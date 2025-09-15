import { NextFunction, Request, Response } from "express";
import UserModel from "../models/user-model";
import NotFoundError from "../errors/not-found-error";
import ForbiddenError from "../errors/forbidden-error";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = res.locals.payload;

    const user = await UserModel.findById(payload.id).orFail(
      new NotFoundError(
        "Пользователь не найден, действия невозможны. Попробуйте перезайти в аккаунт.",
      ),
    );

    if (user.banExpires && user.banExpires != "none") {
      if (Number(user.banExpires) > Number(Date.now())) {
        throw new ForbiddenError("Вы забанены, действие невозможно");
      } else {
        user.banExpires = "none";
        await user.save();
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};
