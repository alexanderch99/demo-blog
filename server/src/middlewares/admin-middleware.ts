import { NextFunction, Request, Response } from "express";
import ForbiddenError from "../errors/forbidden-error";
import UserModel from "../models/user-model";
import NotFoundError from "../errors/not-found-error";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!res.locals?.payload?.role?.isAdmin) {
      throw new ForbiddenError("Вы не администратор");
    }

    const actualUser: any = await UserModel.findById(res.locals?.payload?.id)
      .populate("role")
      .orFail(
        new NotFoundError(
          "Администратор не найден, действие в админ-панели  невозможно",
        ),
      );

    if (!actualUser.role?.isAdmin) {
      throw new ForbiddenError("У Вас больше нет прав администратора");
    }

    next();
  } catch (error) {
    next(error);
  }
};
