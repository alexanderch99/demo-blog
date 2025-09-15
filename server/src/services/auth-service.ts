import { compare, genSalt, hash } from "bcryptjs";
import UserModel from "../models/user-model";
import AuthError from "../errors/auth-error";
import PayloadDTO from "../dtos/payload-dto";
import tokenService from "./token-service";
import { Types } from "mongoose";
import { DEFAULT_ROLE_ID } from "../config/env";
import CounterModel from "../models/counter-model";
import NotFoundError from "../errors/not-found-error";

interface AuthCredentials {
  email: string;
  password: string;
  role: Types.ObjectId;
}

class AuthService {
  async registration(user: AuthCredentials) {
    const { email, password } = user;

    const role = new Types.ObjectId(DEFAULT_ROLE_ID);
    const avatarUrl = "none";
    const bio = "none";
    const location = "none";
    const banExpires = "none";
    const lastOnline = "none";
    const links: any = [];
    const interests: any = [];
    const counter = await CounterModel.findById("users");
    const nicknameSlug = String((counter?.seq as number) + 1 || 1);

    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    await UserModel.create({
      email,
      password: hashPassword,
      role,
      avatarUrl,
      bio,
      location,
      links,
      interests,
      banExpires,
      lastOnline,
      nicknameSlug,
    });
    return;
  }

  async login(user: AuthCredentials) {
    const { email, password } = user;
    const userFromDB = await UserModel.findOne({ email: email.toLowerCase() })
      .populate("role")
      .select("+password");

    if (!userFromDB) {
      throw new AuthError("Неверный логин или пароль");
    }

    const hashPassword = userFromDB.password;

    const isCorrectPassword = await compare(password, hashPassword as string);
    if (!isCorrectPassword) {
      throw new AuthError("Неверный логин или пароль");
    }

    const token = tokenService.createAccessToken(
      JSON.parse(JSON.stringify(new PayloadDTO(userFromDB))),
    );

    const payload = await tokenService.verifyAccessToken(token);

    return { token, payload };
  }

  async verify(oldToken: string) {
    const oldPayload = await tokenService.verifyAccessToken(oldToken);

    const actualUser = await UserModel.findById(oldPayload.id)
      .populate("role")
      .orFail(
        new NotFoundError("Пользователь не найден, аутентификация невозможна"),
      );

    if (
      String(new Date(oldPayload.updatedAt)) !=
        String(new Date(actualUser.updatedAt)) ||
      Number(actualUser.banExpires) < Number(Date.now())
    ) {
      if (Number(actualUser.banExpires) < Number(Date.now())) {
        actualUser.banExpires = "none";
        await actualUser.save();
      }

      const newToken = tokenService.createAccessToken(
        JSON.parse(JSON.stringify(new PayloadDTO(actualUser))),
      );

      const newPayload = await tokenService.verifyAccessToken(newToken);

      return [newToken, newPayload];
    }

    return [oldToken, oldPayload];
  }
}
export default new AuthService();
