import PayloadDTO from "../dtos/payload-dto";
import NotFoundError from "../errors/not-found-error";
import UserModel from "../models/user-model";
import tokenService from "./token-service";
import checkFileType from "../utils/check-file-type";
import { allowedImgExtensions } from "../utils/constants";
import { uploadFileToS3 } from "../s3/s3-upload";
import { rm } from "node:fs/promises";
import toSlug from "../utils/to-slug";
import { S3_URL } from "../config/env";
import { deleteFileFromS3 } from "../s3/s3-delete";
import ForbiddenError from "../errors/forbidden-error";

interface IUserPublicInfo {
  id: string;
  nickname: string;
  bio: string;
  location: string;
  links: Array<object>;
  interests: Array<string>;
  avatarUrl: string;
}

class UserService {
  async getUserPublicInfo(nicknameSlug: string) {
    const user = await UserModel.findOne({ nicknameSlug })
      .populate("role")
      .orFail(new NotFoundError("Пользователь не найден"));

    const userPublicInfo = JSON.parse(JSON.stringify(user));

    delete userPublicInfo.email;

    return userPublicInfo;
  }

  async updateUserPublicInfo(data: IUserPublicInfo, nicknameSlug: string) {
    const id = data.id;
    const newUserPublicInfo = JSON.parse(JSON.stringify(data));

    const user = await UserModel.findById(id)
      .populate("role")
      .orFail(new NotFoundError("Пользователь не существует"));

    if (user.nicknameSlug != nicknameSlug) {
      throw new ForbiddenError("Запрещено изменять чужой профиль");
    }

    if (newUserPublicInfo.nickname == null || !newUserPublicInfo.nickname)
      newUserPublicInfo.nickname = id;

    if (newUserPublicInfo.bio == null || !newUserPublicInfo.bio)
      newUserPublicInfo.bio = "none";

    if (newUserPublicInfo.location == null || !newUserPublicInfo.location)
      newUserPublicInfo.location = "none";

    if (
      newUserPublicInfo.links == null ||
      !newUserPublicInfo.links ||
      !newUserPublicInfo.links.length
    )
      newUserPublicInfo.links = [];

    if (
      newUserPublicInfo.interests == null ||
      !newUserPublicInfo.interests ||
      !newUserPublicInfo.interests.length
    )
      newUserPublicInfo.interests = [];

    if (newUserPublicInfo.avatarUrl == null || !newUserPublicInfo.avatarUrl)
      newUserPublicInfo.avatarUrl = "none";

    user.nickname = newUserPublicInfo.nickname;
    user.bio = newUserPublicInfo.bio;
    user.location = newUserPublicInfo.location;
    user.links = newUserPublicInfo.links;
    user.interests = newUserPublicInfo.interests;
    user.avatarUrl = newUserPublicInfo.avatarUrl;
    user.nicknameSlug = `${String(user.idSimple)}-${toSlug(
      newUserPublicInfo.nickname,
    )}`;

    await user.save();

    const token = tokenService.createAccessToken(
      JSON.parse(JSON.stringify(new PayloadDTO(user))),
    );

    const payload = await tokenService.verifyAccessToken(token);

    return { token, payload };
  }

  async updateUserAvatar(file: any, userId: string, nicknameSlug: string) {
    const user = await UserModel.findById(userId)
      .populate("role")
      .orFail(new NotFoundError("Пользователь не найден, аватар не загружен"));

    if (user.nicknameSlug != nicknameSlug) {
      if (file != null) {
        await rm(file.path);
      }
      throw new ForbiddenError("Запрещено изменять чужой профиль");
    }

    const avatarKeyForDel = user?.avatarUrl?.replace(S3_URL as string, ""); // Подгон под формат Key для удаления
    try {
      if (file != null) {
        // Аватар передан, загрузка
        const fileType = await checkFileType(file.path, allowedImgExtensions);

        const url = await uploadFileToS3({
          filePath: file.path,
          filename: file.filename,
          keyPrefix: "avatars",
          contentType: fileType.mime,
        });

        // Если аватар был - удалить
        if (user.avatarUrl && user.avatarUrl != "none") {
          await deleteFileFromS3(avatarKeyForDel);
        }

        user.avatarUrl = url as string;
      } else {
        // Аватар не был передан, флаг delete передан в контроллер, удаление
        await deleteFileFromS3(avatarKeyForDel);
        user.avatarUrl = "none";
      }

      await user.save();

      const token = tokenService.createAccessToken(
        JSON.parse(JSON.stringify(new PayloadDTO(user))),
      );

      const payload = await tokenService.verifyAccessToken(token);

      if (file != null) {
        await rm(file.path);
      }

      return { token, payload };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (file != null) {
        await rm(file.path);
      }
      throw new Error(
        "Аватар не был загружен из-за ошибки сервера, попробуйте еще раз",
      );
    }
  }
}

export default new UserService();
