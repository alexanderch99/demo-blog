import BadRequestError from "../errors/bad-request-error";
import ForbiddenError from "../errors/forbidden-error";
import NotFoundError from "../errors/not-found-error";
import BlogModel from "../models/blog-model";
import PostModel from "../models/post-model";
import toSlug from "../utils/to-slug";

interface IPostData {
  title: string;
  body: string;
  tags: Array<string>;
  nicknameSlug: string;
  blogId?: string;
  postId?: string;
}

class PostService {
  async createPost(data: IPostData, id: string, authorNicknameSlug: string) {
    const { title, body, tags, nicknameSlug, blogId } = data;

    if (authorNicknameSlug != nicknameSlug) {
      throw new ForbiddenError("Создавать посты можно только в своем блоге");
    }

    const blog = await BlogModel.findById(blogId).orFail(
      new NotFoundError("Не найден блог, для которого создается пост"),
    );

    if (String(id) != String(blog.author)) {
      throw new ForbiddenError("Запрещено создавать посты в чужом блоге");
    }

    blog.postsCount += 1;
    await blog.save();

    const author = id;
    const hidden = blog.hidden;
    const pinned = false;
    const likesCount = 0;
    const dislikesCount = 0;
    const whoLike = [] as any;
    const whoDislike = [] as any;
    const postSlug = toSlug(title);

    const newPost = await PostModel.create({
      title,
      body,
      blog: blogId,
      author,
      hidden,
      pinned,
      tags,
      likesCount,
      dislikesCount,
      whoLike,
      whoDislike,
      postSlug,
    });
    return newPost;
  }

  async editPost(data: IPostData, id: string, authorNicknameSlug: string) {
    const { title, body, tags, nicknameSlug, postId } = data;
    const post = await PostModel.findById(postId).orFail(
      new NotFoundError("Пост не наден, редактирование невозможно"),
    );

    if (String(id) != String(post.author)) {
      throw new ForbiddenError("Запрещено редактировать чужие посты");
    }

    if (authorNicknameSlug != nicknameSlug) {
      throw new ForbiddenError(
        "Редактировать посты можно только в своих блогах",
      );
    }

    post.title = title;
    post.body = body;
    post.tags = tags;
    post.postSlug = `${post.idSimple}-${toSlug(title)}`;

    await post.save();

    return post;
  }

  async getAllPosts() {
    const allPosts = await PostModel.find()
      // .populate({
      //   path: "blog",
      //   populate: {
      //     path: "author",
      //     select: "id nickname nicknameSlug avatarUrl",
      //   },
      // })
      .orFail(new NotFoundError("Постов нет"));
    return allPosts;
  }

  async getBlogPosts(blogSlug: string, userId: string) {
    const thisBlog = await BlogModel.findOne({ blogSlug }).orFail(
      new NotFoundError("Блог не найден"),
    );

    const blogPosts = await PostModel.find({ blog: thisBlog._id })
      .populate({
        path: "author",
        select: "id nickname nicknameSlug avatarUrl",
      })
      .sort({ pinned: -1, createdAt: -1 });

    return String(thisBlog.author) == userId
      ? blogPosts
      : blogPosts.filter(el => !el.hidden);
  }

  async getBlogPost(postSlug: string, userId: string) {
    const blogPost: any = await PostModel.findOne({ postSlug })
      .populate({
        path: "author",
        select: "id nickname nicknameSlug avatarUrl",
      })
      .orFail(new NotFoundError("Пост не найден"));

    if (blogPost.author.id != userId && blogPost.hidden) {
      throw new ForbiddenError("Этот пост скрыт");
    }

    return blogPost;
  }

  async getLatestPosts() {
    const posts = await PostModel.find({ hidden: { $ne: true } })
      .limit(7)
      .sort({ createdAt: -1 })
      .populate([
        {
          path: "author",
        },
        { path: "blog", select: "id title blogSlug" },
      ]);
    return posts;
  }

  async deletePost(postId: string, userId: string) {
    const post = await PostModel.findById(postId).orFail(
      new NotFoundError("Пост не найден, удаление невозможно"),
    );

    if (String(post.author) != userId) {
      throw new ForbiddenError("Запрещено удалять чужие посты");
    }

    await BlogModel.findByIdAndUpdate(
      post.blog,
      { $inc: { postsCount: -1 } },
      { new: true },
    );

    await PostModel.deleteOne({ _id: postId });

    return true;
  }

  async pinTogglePost(postId: string, userId: string) {
    const postForUpdate = await PostModel.findById(postId).orFail(
      new NotFoundError("Пост не найден, закрепление и открепление невозможно"),
    );

    if (String(postForUpdate.author) != userId) {
      throw new ForbiddenError("Запрещено закреплять и откреплять чужие посты");
    }

    postForUpdate.pinned = !postForUpdate.pinned;

    postForUpdate.save();

    return postForUpdate.pinned;
  }

  async hideTogglePost(postId: string, userId: string) {
    const postForUpdate = await PostModel.findById(postId).orFail(
      new NotFoundError("Пост не найден, скрытие невозможно"),
    );

    if (String(postForUpdate.author) != userId) {
      throw new ForbiddenError("Запрещено скрывать чужие посты");
    }

    const blog = await BlogModel.findById(postForUpdate.blog).orFail(
      new NotFoundError("Блог не найден"),
    );

    if (blog.hidden && postForUpdate.hidden) {
      throw new BadRequestError(
        "Все посты в скрытом блоге должны быть скрытыми",
      );
    }

    postForUpdate.hidden = !postForUpdate.hidden;
    postForUpdate.pinned = false;

    postForUpdate.save();

    return postForUpdate.hidden;
  }

  async likePost(postId: string, userId: string) {
    const post = await PostModel.findById(postId).orFail(
      new NotFoundError("Пост не найден, лайк невозможен"),
    );

    if (String(post.author) == userId) {
      throw new BadRequestError("Нельзя оценивать свои посты");
    }

    if (post.hidden) {
      throw new BadRequestError("Нельзя оценивать скрытые посты");
    }

    const blog = await BlogModel.findById(post.blog).orFail(
      new NotFoundError("Блог, в котором находится этот пост не найден"),
    );

    if (post.whoLike.includes(userId)) {
      post.whoLike.splice(
        post.whoLike.findIndex(el => el == userId),
        1,
      );
      post.likesCount -= 1;
      blog.ratingCount -= 1;
    } else if (post.whoDislike.includes(userId)) {
      post.whoDislike.splice(
        post.whoDislike.findIndex(el => el == userId),
        1,
      );
      post.whoLike.push(userId);
      post.dislikesCount -= 1;
      post.likesCount += 1;
      blog.ratingCount += 2;
    } else {
      post.whoLike.push(userId);
      post.likesCount += 1;
      blog.ratingCount += 1;
    }

    await post.save({ timestamps: false });
    await blog.save({ timestamps: false });

    return [post.whoLike, post.likesCount];
  }

  async dislikePost(postId: string, userId: string) {
    const post = await PostModel.findById(postId).orFail(
      new NotFoundError("Пост не найден, дизлайк невозможен"),
    );

    if (String(post.author) == userId) {
      throw new BadRequestError("Нельзя оценивать свои посты");
    }

    if (post.hidden) {
      throw new BadRequestError("Нельзя оценивать скрытые посты");
    }

    const blog = await BlogModel.findById(post.blog).orFail(
      new NotFoundError("Блог, в котором находится этот пост не найден"),
    );

    if (post.whoDislike.includes(userId)) {
      post.whoDislike.splice(
        post.whoDislike.findIndex(el => el == userId),
        1,
      );
      post.dislikesCount -= 1;
      blog.ratingCount += 1;
    } else if (post.whoLike.includes(userId)) {
      post.whoLike.splice(
        post.whoLike.findIndex(el => el == userId),
        1,
      );
      post.whoDislike.push(userId);
      post.likesCount -= 1;
      post.dislikesCount += 1;
      blog.ratingCount -= 2;
    } else {
      post.whoDislike.push(userId);
      post.dislikesCount += 1;
      blog.ratingCount -= 1;
    }

    await post.save({ timestamps: false });
    await blog.save({ timestamps: false });

    return [post.whoDislike, post.dislikesCount];
  }
}

export default new PostService();
