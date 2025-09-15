import { NextFunction, Request, Response } from "express";
import userService from "../services/user-service";
import { JWT_EXPIRES } from "../config/env";
import BadRequestError from "../errors/bad-request-error";

class UserController {
  async getUserPublicInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const userPublicInfo = await userService.getUserPublicInfo(
        req.params.nicknameSlug,
      );
      res.json(userPublicInfo);
    } catch (error) {
      next(error);
    }
  }

  async updateUserPublicInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, payload } = await userService.updateUserPublicInfo(
        req.body,
        req.params.nicknameSlug,
      );

      res.cookie("accessToken", token, {
        httpOnly: true,
        maxAge: +(JWT_EXPIRES as string),
      });

      res.json(payload);
    } catch (error) {
      next(error);
    }
  }

  async updateUserAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.file == null && req.body.type !== "delete") {
        throw new BadRequestError(
          "Аватар не был передан для загрузки на сервер",
        );
      }
      const { token, payload } = await userService.updateUserAvatar(
        req.file,
        res.locals.payload.id,
        req.params.nicknameSlug,
      );

      res.cookie("accessToken", token, {
        httpOnly: true,
        maxAge: +(JWT_EXPIRES as string),
      });

      res.json(payload);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
