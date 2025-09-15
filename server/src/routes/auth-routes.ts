import { Router } from "express";
import authController from "../controllers/auth-controller";
import { validateAuth } from "../validations/validate-auth";

const authRouter = Router();

authRouter.post(
  "/registration",
  validateAuth,
  authController.registration.bind(authController),
);
authRouter.post("/login", authController.login);
authRouter.get("/verify", authController.verify);
authRouter.get("/logout", authController.logout);

export default authRouter;
