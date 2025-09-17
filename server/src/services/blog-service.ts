/* eslint-disable @typescript-eslint/no-unused-vars */
import { S3_URL } from "../config/env";
import ForbiddenError from "../errors/forbidden-error";
import NotFoundError from "../errors/not-found-error";
import BlogModel from "../models/blog-model";
import PostModel from "../models/post-model";
import UserModel from "../models/user-model";
import { saveToRedis } from "../redis/redis-utils";
import { deleteFileFromS3 } from "../s3/s3-delete";
import { uploadFileToS3 } from "../s3/s3-upload";
import checkFileType from "../utils/check-file-type";
import { allowedImgExtensions } from "../utils/constants";
import toSlug from "../utils/to-slug";
import { rm } from "node:fs/promises";

interface INewBlogData {
  title: string;
  nicknameSlug: string;
}

class BlogService {
  async createBlog(data: INewBlogData, id: string, authorNicknameSlug: string) {
    const { title, nicknameSlug } = data;

    if (authorNicknameSlug != nicknameSlug) {
      throw new ForbiddenError(
        "Создавать блоги можно только из своего списка блогов",
      );
    }

    const author = id;
    const coverUrl = "none";
    const hidden = false;
    const pinned = false;
    const postsCount = 0;
    const viewsCount = 0;
    const ratingCount = 0;
    const blogSlug = toSlug(title);
    const newBlog = await BlogModel.create({
      title,
      blogSlug,
      author,
      coverUrl,
      hidden,
      pinned,
      postsCount,
      viewsCount,
      ratingCount,
    });
    return newBlog;
  }

  async getAllBlogs(cacheKey: string, ttl: number) {
    const blogs: any = await BlogModel.find()
      .populate({
        path: "author",
        select: "id nickname nicknameSlug avatarUrl",
      })
      .orFail(new NotFoundError("Блоги не найдены"));
    // const respone = await fetch("https://jsonplaceholder.typicode.com/todos");
    // const todos = await respone.json();
    // await saveToRedis(cacheKey, todos, ttl);
    return blogs;
  }

  async getUserBlogs(nicknameSlug: string, userId: string) {
    const user = await UserModel.findOne({ nicknameSlug }).orFail(
      new NotFoundError("Пользователь не найден, его блоги недоступны"),
    );

    const userBlogs = await BlogModel.find({
      author: user.id,
    })
      .populate({
        path: "author",
        select: "id nickname nicknameSlug avatarUrl",
      })
      .sort({ pinned: -1, createdAt: -1 });

    return String(user._id) == userId
      ? userBlogs
      : userBlogs.filter(el => !el.hidden);
  }

  async getUserBlog(blogSlug: string, userId: string) {
    const userBlog: any = await BlogModel.findOne({ blogSlug })
      .populate({
        path: "author",
        select: "id nickname nicknameSlug avatarUrl",
      })
      .orFail(new NotFoundError("Блог не найден"));

    if (userBlog.author.id != userId && userBlog.hidden) {
      throw new ForbiddenError("Этот блог скрыт");
    }

    if (!userBlog.hidden) {
      userBlog.viewsCount += 1;
      await userBlog.save();
    }
    return userBlog;
  }

  async getPopularBlogs(originalUrl: string, ttl: number) {
    const blogs = await BlogModel.find({ hidden: false })
      .limit(7)
      .sort({ ratingCount: -1 })
      .populate({
        path: "author",
        select: "id nickname nicknameSlug avatarUrl",
      });

    console.log(originalUrl);
    await saveToRedis(originalUrl, blogs, ttl || 60);
    console.log("saved");

    return blogs;
  }

  async updateBlogTitle(blogId: string, blogNewTitle: string, id: string) {
    const blogForUpdate = await BlogModel.findById(blogId).orFail(
      new NotFoundError("Блог не найден"),
    );

    if (String(blogForUpdate.author) != id) {
      throw new ForbiddenError("Запрещено изменять чужой блог");
    }

    blogForUpdate.title = blogNewTitle;
    blogForUpdate.blogSlug = `${String(blogForUpdate.idSimple)}-${toSlug(
      blogNewTitle,
    )}`;

    await blogForUpdate.save();

    return blogForUpdate;
  }

  async updateBlogCover(file: any, userId: string, blogId: string) {
    const blog = await BlogModel.findById(blogId).orFail(
      new NotFoundError("Блог не найден, обложка не загружена"),
    );

    if (String(blog.author) != userId) {
      if (file != null) {
        await rm(file.path);
      }
      throw new ForbiddenError("Запрещено изменять чужой блог");
    }

    const blogCoverKeyForDel = blog?.coverUrl?.replace(S3_URL as string, ""); // Подгон под формат Key для удаления
    try {
      if (file != null) {
        // Обложка блога передана, загрузка
        const fileType = await checkFileType(file.path, allowedImgExtensions);

        const url = await uploadFileToS3({
          filePath: file.path,
          filename: file.filename,
          keyPrefix: "blog-covers",
          contentType: fileType.mime,
        });

        // Если обложка блога была - удалить
        if (blog.coverUrl && blog.coverUrl != "none") {
          await deleteFileFromS3(blogCoverKeyForDel);
        }

        blog.coverUrl = url as string;
      } else {
        // Обложка блога не была передана, флаг delete передан в контроллер, удаление
        await deleteFileFromS3(blogCoverKeyForDel);
        blog.coverUrl = "none";
      }

      await blog.save();

      if (file != null) {
        await rm(file.path);
      }

      return true;
    } catch (error) {
      console.log(error);
      if (file != null) {
        await rm(file.path);
      }
      throw new Error(
        "Обложка блога не была загружена из-за ошибки сервера, попробуйте еще раз",
      );
    }
  }

  async deleteBlog(blogId: string, userId: string) {
    const blog = await BlogModel.findById(blogId).orFail(
      new NotFoundError("Блог не найден, удаление невозможно"),
    );

    if (String(blog.author) != String(userId)) {
      throw new ForbiddenError("Запрещено удалять чужие блоги");
    }

    // Удаление обложки блога, если она есть
    if (blog.coverUrl && blog.coverUrl != "none") {
      const blogCoverKeyForDel = blog?.coverUrl?.replace(S3_URL as string, "");
      await deleteFileFromS3(blogCoverKeyForDel);
      blog.coverUrl = "none";
    }

    // Удаление всех постов этого блога
    await PostModel.deleteMany({ blog: blogId });

    // Удаление блога
    await BlogModel.deleteOne({ _id: blogId });

    return true;
  }

  async pinToggleBlog(blogId: string, userId: string) {
    const blogForUpdate = await BlogModel.findById(blogId).orFail(
      new NotFoundError("Блог не найден, закрепление и открепление невозможно"),
    );

    if (String(blogForUpdate.author) != userId) {
      throw new ForbiddenError("Запрещено закреплять и откреплять чужие блоги");
    }

    blogForUpdate.pinned = !blogForUpdate.pinned;

    blogForUpdate.save();

    return blogForUpdate.pinned;
  }

  async hideToggleBlog(blogId: string, userId: string) {
    const blogForUpdate = await BlogModel.findById(blogId).orFail(
      new NotFoundError("Блог не найден, скрытие невозможно"),
    );

    if (String(blogForUpdate.author) != userId) {
      throw new ForbiddenError("Запрещено скрывать чужие блоги");
    }

    blogForUpdate.hidden = !blogForUpdate.hidden;
    blogForUpdate.pinned = false;

    blogForUpdate.save();

    await PostModel.updateMany(
      { blog: blogId },
      { $set: { hidden: blogForUpdate.hidden } },
    );

    return blogForUpdate.hidden;
  }
}

export default new BlogService();
