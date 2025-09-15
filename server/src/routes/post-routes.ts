import { Router } from "express";
import postController from "../controllers/post-controller";
import authMiddleware from "../middlewares/auth-middleware";
import sameUserMiddleware from "../middlewares/same-user-middleware";
import { validatePost } from "../validations/validate-post";
import checkUserMiddleware from "../middlewares/check-user-middleware";

const postRouter = Router();

postRouter.post(
  "/create",
  [authMiddleware, checkUserMiddleware, sameUserMiddleware, validatePost],
  postController.createPost,
);
postRouter.patch(
  "/edit",
  [authMiddleware, checkUserMiddleware, sameUserMiddleware, validatePost],
  postController.editPost,
);
postRouter.get("/all-posts/get", postController.getAllPosts);
postRouter.get("/blog-posts/get/:blogSlug", postController.getBlogPosts);
postRouter.get("/blog-post/get/:postSlug", postController.getBlogPost);
postRouter.get("/latest-posts/get", postController.getLatestPosts);
postRouter.delete(
  "/delete/:postId",
  [authMiddleware, checkUserMiddleware],
  postController.deletePost,
);
postRouter.patch(
  "/pin-toggle",
  [authMiddleware, checkUserMiddleware, sameUserMiddleware],
  postController.pinTogglePost,
);
postRouter.patch(
  "/hide-toggle",
  [authMiddleware, checkUserMiddleware, sameUserMiddleware],
  postController.hideTogglePost,
);
postRouter.patch(
  "/like",
  [authMiddleware, checkUserMiddleware],
  postController.likePost,
);
postRouter.patch(
  "/dislike",
  [authMiddleware, checkUserMiddleware],
  postController.dislikePost,
);

export default postRouter;
