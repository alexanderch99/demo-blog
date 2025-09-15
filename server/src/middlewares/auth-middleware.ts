import { NextFunction, Request, Response } from "express";
import tokenService from "../services/token-service";
import AuthError from "../errors/auth-error";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req?.cookies?.accessToken;
    if (!token) {
      throw new AuthError("Нет токена");
    }

    const payload = await tokenService.verifyAccessToken(token);
    if (!payload) {
      throw new AuthError("Невалидный токен");
    }

    res.locals.payload = payload;

    next();
  } catch (error) {
    next(error);
  }
};
