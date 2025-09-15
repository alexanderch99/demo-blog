import { Router } from "express";
import userController from "../controllers/user-controller";
import authMiddleware from "../middlewares/auth-middleware";
import sameUserMiddleware from "../middlewares/same-user-middleware";
import { validateUserPublicInfo } from "../validations/validate-user-public-info";
import uploadAvatar from "../multer/multer-avatar-upload";
import checkUserMiddleware from "../middlewares/check-user-middleware";

const userRouter = Router();

userRouter.get(
  "/public-info/get/:nicknameSlug",
  userController.getUserPublicInfo,
);
userRouter.patch(
  "/public-info/update/:nicknameSlug",
  [
    authMiddleware,
    checkUserMiddleware,
    sameUserMiddleware,
    validateUserPublicInfo,
  ],
  userController.updateUserPublicInfo,
);
userRouter.patch(
  "/avatar/update/:nicknameSlug",
  [authMiddleware, checkUserMiddleware, uploadAvatar, sameUserMiddleware],
  userController.updateUserAvatar,
);

export default userRouter;
