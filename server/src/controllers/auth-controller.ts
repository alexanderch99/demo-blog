import { NextFunction, Request, Response } from "express";
import authService from "../services/auth-service";
import { JWT_EXPIRES } from "../config/env";
import AuthError from "../errors/auth-error";
// import BadRequestError from "../errors/bad-request-error";

class AuthController {
  async registration(req: Request, res: Response, next: NextFunction) {
    // throw new BadRequestError(
    //   "Регистрация недоступна. Этот демонстрационный сайт не работает с персональными данными",
    // );
    console.log("test 6");
    try {
      await authService.registration(req.body);
      return this.login(req, res, next);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, payload } = await authService.login(req.body);
      res.cookie("accessToken", token, {
        httpOnly: true,
        maxAge: +(JWT_EXPIRES as string),
      });

      res.json(payload);
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const oldToken = req.cookies.accessToken;
      const [token, payload] = await authService.verify(oldToken);

      if (!payload) {
        throw new AuthError("Пользователь не аутентифицирован");
      }

      if (oldToken != token) {
        res.cookie("accessToken", token, {
          httpOnly: true,
          maxAge: +(JWT_EXPIRES as string),
        });
      }

      res.json(payload);
    } catch (error) {
      res.clearCookie("accessToken", {
        httpOnly: true,
      });
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie("accessToken", {
        httpOnly: true,
      });

      res.json({ message: "Успешный выход" });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
