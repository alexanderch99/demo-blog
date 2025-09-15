import jwt from "jsonwebtoken";
import { JWT_ACCESS, JWT_EXPIRES } from "../config/env";
import AuthError from "../errors/auth-error";
// import UserModel from "../models/user-model";
import CustomError from "../errors/custom-error";

class TokenService {
  createAccessToken(payload: object) {
    try {
      const accessToken = jwt.sign(payload, JWT_ACCESS as string, {
        expiresIn: +(JWT_EXPIRES as string) / 1000,
      });
      return accessToken;
    } catch (error) {
      console.error(error);
      throw new Error();
    }
  }

  async verifyAccessToken(token: string) {
    try {
      const payload = jwt.verify(token, JWT_ACCESS as string);

      if (typeof payload == "string") {
        throw new Error("Ошибка создания токена");
      }

      // const user = await UserModel.findById(payload.id);
      // if (!user) {
      //   return false;
      // }

      return payload;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      } else {
        throw new AuthError("Пользователь не аутентифицирован");
      }
    }
  }
}

export default new TokenService();
