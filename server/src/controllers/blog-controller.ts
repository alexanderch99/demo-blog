import { NextFunction, Request, Response } from "express";
import blogService from "../services/blog-service";
import BadRequestError from "../errors/bad-request-error";
import tokenService from "../services/token-service";
// import NotFoundError from "../errors/not-found-error";

class BlogController {
  async createBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const newBlog = await blogService.createBlog(
        req.body,
        res.locals.payload.id,
        res.locals.payload.nicknameSlug,
      );
      res.json(newBlog);
    } catch (error) {
      next(error);
    }
  }

  async getAllBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const blogs = await blogService.getAllBlogs(
        res.locals?.cacheKey,
        res.locals?.ttl,
      );
      res.json(blogs);
    } catch (error) {
      next(error);
    }
  }

  async getUserBlogs(req: Request, res: Response, next: NextFunction) {
    let payload: any = null;

    try {
      payload = await tokenService.verifyAccessToken(req.cookies.accessToken);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}

    try {
      const userBlogs = await blogService.getUserBlogs(
        req.params.nicknameSlug,
        payload?.id,
      );
      res.json(userBlogs);
    } catch (error) {
      next(error);
    }
  }

  async getUserBlog(req: Request, res: Response, next: NextFunction) {
    let payload: any = null;

    try {
      payload = await tokenService.verifyAccessToken(req.cookies.accessToken);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}

    try {
      const userBlog = await blogService.getUserBlog(
        req.params.blogSlug,
        payload?.id,
      );
      res.json(userBlog);
    } catch (error) {
      next(error);
    }
  }

  async getPopularBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const blogs = await blogService.getPopularBlogs();
      setTimeout(() => {
        res.json(blogs);
      }, 1000);
    } catch (error) {
      next(error);
    }
  }

  async updateBlogTitle(req: Request, res: Response, next: NextFunction) {
    try {
      const updatedBlog = await blogService.updateBlogTitle(
        req.body.blogId,
        req.body.title,
        res.locals.payload.id,
      );
      res.json(updatedBlog);
    } catch (error) {
      next(error);
    }
  }

  async updateBlogCover(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file == null && req.body.type !== "delete") {
        throw new BadRequestError(
          "Обложка блога не была передана для загрузки на сервер",
        );
      }
      await blogService.updateBlogCover(
        req.file,
        res.locals.payload.id,
        req.body.blogId,
      );

      res.json({ message: "Обложка блога успешно изменена" });
    } catch (error) {
      next(error);
    }
  }

  async deleteBlog(req: Request, res: Response, next: NextFunction) {
    try {
      await blogService.deleteBlog(req.params.blogId, res.locals.payload.id);
      res.json({ message: "Блог и все посты этого блога удалены" });
    } catch (error) {
      next(error);
    }
  }

  async pinToggleBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await blogService.pinToggleBlog(
        req.body.blogId,
        res.locals.payload.id,
      );
      res.json(
        result ? { message: "Блог закреплен" } : { message: "Блог откреплен" },
      );
    } catch (error) {
      next(error);
    }
  }

  async hideToggleBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await blogService.hideToggleBlog(
        req.body.blogId,
        res.locals.payload.id,
      );
      res.json(
        result
          ? { message: "Блог скрыт" }
          : { message: "Блог снова публичный" },
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new BlogController();
