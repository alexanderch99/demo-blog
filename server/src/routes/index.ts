import { Router } from "express";
import blogRouter from "./blog-routes";
import userRouter from "./user-routes";
import authRouter from "./auth-routes";
import postRouter from "./post-routes";
import adminRouter from "./admin-routes";

const router = Router();

router.use("/api/v1/blogs", blogRouter);
router.use("/api/v1/users", userRouter);
router.use("/api/v1/auth", authRouter);
router.use("/api/v1/posts", postRouter);
router.use("/api/v1/admin", adminRouter);

export default router;
