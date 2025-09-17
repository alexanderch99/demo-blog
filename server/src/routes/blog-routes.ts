import { Router } from "express";
import blogController from "../controllers/blog-controller";
import authMiddleware from "../middlewares/auth-middleware";
import sameUserMiddleware from "../middlewares/same-user-middleware";
import uploadBlogCover from "../multer/multer-blog-cover-upload";
import { validateBlog } from "../validations/validate-blog";
import checkUserMiddleware from "../middlewares/check-user-middleware";
import cacheMiddleware from "../middlewares/cache-middleware";
// cacheMiddleware(60)

const blogRouter = Router();

blogRouter.post(
  "/create",
  [authMiddleware, checkUserMiddleware, sameUserMiddleware, validateBlog],
  blogController.createBlog,
);
blogRouter.get("/all-blogs/get", blogController.getAllBlogs);
blogRouter.get("/user-blogs/get/:nicknameSlug", blogController.getUserBlogs);
blogRouter.get("/user-blog/get/:blogSlug", blogController.getUserBlog);
blogRouter.get(
  "/popular-blogs/get",
  cacheMiddleware(60),
  blogController.getPopularBlogs,
);
blogRouter.patch(
  "/title/update",
  [authMiddleware, checkUserMiddleware, sameUserMiddleware, validateBlog],
  blogController.updateBlogTitle,
);
blogRouter.patch(
  "/cover/update",
  [authMiddleware, checkUserMiddleware, uploadBlogCover, sameUserMiddleware],
  blogController.updateBlogCover,
);
blogRouter.delete(
  "/delete/:blogId",
  [authMiddleware, checkUserMiddleware],
  blogController.deleteBlog,
);
blogRouter.patch(
  "/pin-toggle",
  [authMiddleware, checkUserMiddleware, sameUserMiddleware],
  blogController.pinToggleBlog,
);
blogRouter.patch(
  "/hide-toggle",
  [authMiddleware, checkUserMiddleware, sameUserMiddleware],
  blogController.hideToggleBlog,
);

export default blogRouter;
