import { NextFunction, Request, Response } from "express";
import ForbiddenError from "../errors/forbidden-error";
import BadRequestError from "../errors/bad-request-error";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = res?.locals?.payload;

    if (!payload || !payload?.id || !req?.body || !req?.body?.id) {
      throw new BadRequestError("Некорректный запрос");
    }

    const id = req.body.id;

    if (payload.id != id) {
      throw new ForbiddenError("Отправлены данные другого пользователя");
    }

    next();
  } catch (error) {
    next(error);
  }
};
