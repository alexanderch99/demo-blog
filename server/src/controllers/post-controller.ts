import { NextFunction, Request, Response } from "express";
import postService from "../services/post-service";
import tokenService from "../services/token-service";

class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    try {
      const newPost = await postService.createPost(
        req.body,
        res.locals.payload.id,
        res.locals.payload.nicknameSlug,
      );
      res.json(newPost);
    } catch (error) {
      next(error);
    }
  }

  async editPost(req: Request, res: Response, next: NextFunction) {
    try {
      const editedPost = await postService.editPost(
        req.body,
        res.locals.payload.id,
        res.locals.payload.nicknameSlug,
      );
      res.json(editedPost);
    } catch (error) {
      next(error);
    }
  }

  async getAllPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const allPosts = await postService.getAllPosts();
      res.json(allPosts);
    } catch (error) {
      next(error);
    }
  }

  async getBlogPosts(req: Request, res: Response, next: NextFunction) {
    let payload: any = null;

    try {
      payload = await tokenService.verifyAccessToken(req.cookies.accessToken);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}

    try {
      const blogPosts = await postService.getBlogPosts(
        req.params.blogSlug,
        payload?.id,
      );
      res.json(blogPosts);
    } catch (error) {
      next(error);
    }
  }

  async getBlogPost(req: Request, res: Response, next: NextFunction) {
    let payload: any = null;

    try {
      payload = await tokenService.verifyAccessToken(req.cookies.accessToken);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}

    try {
      const blogPost = await postService.getBlogPost(
        req.params.postSlug,
        payload?.id,
      );
      res.json(blogPost);
    } catch (error) {
      next(error);
    }
  }

  async getLatestPosts(req: Request, res: Response, next: NextFunction) {
    try {
      const posts = await postService.getLatestPosts();
      setTimeout(() => {
        res.json(posts);
      }, 2000);
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: Request, res: Response, next: NextFunction) {
    try {
      await postService.deletePost(req.params.postId, res.locals.payload.id);
      res.json({ message: "Пост удален" });
    } catch (error) {
      next(error);
    }
  }

  async pinTogglePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await postService.pinTogglePost(
        req.body.postId,
        res.locals.payload.id,
      );
      res.json(
        result ? { message: "Пост закреплен" } : { message: "Пост откреплен" },
      );
    } catch (error) {
      next(error);
    }
  }

  async hideTogglePost(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await postService.hideTogglePost(
        req.body.postId,
        res.locals.payload.id,
      );
      res.json(
        result
          ? { message: "Пост скрыт" }
          : { message: "Пост снова публичный" },
      );
    } catch (error) {
      next(error);
    }
  }

  async likePost(req: Request, res: Response, next: NextFunction) {
    try {
      const [whoLike, likesCount] = await postService.likePost(
        req.body.postId,
        res.locals.payload.id,
      );
      res.json({ whoLike, likesCount });
    } catch (error) {
      next(error);
    }
  }

  async dislikePost(req: Request, res: Response, next: NextFunction) {
    try {
      const [whoDislike, dislikesCount] = await postService.dislikePost(
        req.body.postId,
        res.locals.payload.id,
      );
      res.json({ whoDislike, dislikesCount });
    } catch (error) {
      next(error);
    }
  }
}

export default new PostController();
