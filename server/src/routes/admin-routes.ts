import { Router } from "express";
import adminController from "../controllers/admin-controller";
import authMiddleware from "../middlewares/auth-middleware";
import adminMiddleware from "../middlewares/admin-middleware";
import { validateRoleBody } from "../validations/validate-role";

const adminRouter = Router();

adminRouter.get(
  "/all-users/get",
  [authMiddleware, adminMiddleware],
  adminController.getAllUsers,
);
adminRouter.get(
  "/stats/get",
  [authMiddleware, adminMiddleware],
  adminController.getStats,
);
adminRouter.patch(
  "/user-nickname/reset",
  [authMiddleware, adminMiddleware],
  adminController.resetUserNickname,
);
adminRouter.patch(
  "/user-public-info/reset",
  [authMiddleware, adminMiddleware],
  adminController.resetUserPublicInfo,
);
adminRouter.patch(
  "/user-avatar/reset",
  [authMiddleware, adminMiddleware],
  adminController.resetUserAvatar,
);
adminRouter.patch(
  "/user/ban",
  [authMiddleware, adminMiddleware],
  adminController.userBan,
);
adminRouter.patch(
  "/user/unban",
  [authMiddleware, adminMiddleware],
  adminController.userUnban,
);
adminRouter.patch(
  "/user-role/update",
  [authMiddleware, adminMiddleware],
  adminController.changeUserRole,
);
adminRouter.get(
  "/all-roles/get",
  [authMiddleware, adminMiddleware],
  adminController.getAllRoles,
);
adminRouter.post(
  "/role/create",
  [authMiddleware, adminMiddleware, validateRoleBody],
  adminController.createRole,
);
adminRouter.delete(
  "/role/delete/:roleId",
  [authMiddleware, adminMiddleware],
  adminController.deleteRole,
);

export default adminRouter;
