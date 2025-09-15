import { DEFAULT_ROLE_ID, S3_URL } from "../config/env";
import ConflictError from "../errors/conflict-error";
import ForbiddenError from "../errors/forbidden-error";
import NotFoundError from "../errors/not-found-error";
import DailyStatsModel from "../models/daily-stats-model";
import RoleModel from "../models/role-model";
import UserModel from "../models/user-model";
import { deleteFileFromS3 } from "../s3/s3-delete";

interface IRoleData {
  name: string;
  displayName: string;
  isAdmin: boolean;
  priority: number;
}

class AdminService {
  async getAllUsers() {
    const users = await UserModel.find().populate("role");

    return users;
  }

  async getStats() {
    const stats = (
      await DailyStatsModel.find().limit(30).sort({ createdAt: -1 })
    ).reverse();

    return stats;
  }

  async resetUserNickname(userId: string) {
    const user = await UserModel.findById(userId).orFail(
      new NotFoundError("Пользователь не найден, сброс никнейма невозможен"),
    );

    user.nickname = user.id;
    user.nicknameSlug = `${user.idSimple}-${user.id}`;

    await user.save();

    return true;
  }

  async resetUserPublicInfo(userId: string) {
    const user = await UserModel.findById(userId).orFail(
      new NotFoundError(
        "Пользователь не найден, сброс публичной информации профиля невозможен",
      ),
    );

    user.bio = "none";
    user.location = "none";
    user.links = [];
    user.interests = [];

    await user.save();

    return true;
  }

  async resetUserAvatar(userId: string) {
    const user = await UserModel.findById(userId).orFail(
      new NotFoundError("Пользователь не найден, сброс аватара невозможен"),
    );

    if (user.avatarUrl && user.avatarUrl != "none") {
      const avatarKeyForDel = user?.avatarUrl?.replace(S3_URL as string, "");
      await deleteFileFromS3(avatarKeyForDel);
    }

    user.avatarUrl = "none";

    await user.save();

    return true;
  }

  async userBan(userId: string, banExpires: number | string) {
    const user = await UserModel.findById(userId).orFail(
      new NotFoundError("Пользователь не найден, бан невозможен"),
    );

    user.banExpires = String(banExpires);

    await user.save();

    return true;
  }

  async userUnban(userId: string) {
    const user = await UserModel.findById(userId).orFail(
      new NotFoundError("Пользователь не найден, разбан невозможен"),
    );

    user.banExpires = "none";

    await user.save();

    return true;
  }

  async changeUserRole(userId: string, roleId: string) {
    const user = await UserModel.findById(userId).orFail(
      new NotFoundError("Пользователь не найден, изменение группы невозможно"),
    );

    user.role = roleId;

    await user.save();

    return true;
  }

  async getAllRoles() {
    const roles = await RoleModel.find().sort({ secured: -1, priority: -1 });
    return roles;
  }

  async createRole(data: IRoleData) {
    const role = await RoleModel.find({ name: data.name });

    if (role.length > 0) {
      throw new ConflictError("Такая роль уже есть");
    }

    const newRole = {
      name: data.name,
      displayName: data.displayName,
      priority: data.priority,
      isAdmin: data.isAdmin,
      permissions: ["none"],
      secured: false,
    };

    await RoleModel.create(newRole);

    return true;
  }

  async deleteRole(roleId: string) {
    const role = await RoleModel.findById(roleId).orFail(
      new NotFoundError("Группа не найдена, удаление невозможно"),
    );

    if (role.secured) {
      throw new ForbiddenError("Взаимодействие с этой группой запрещено");
    }

    const thisRoleUsers = await UserModel.find({ role: role.id });

    if (thisRoleUsers && thisRoleUsers.length) {
      thisRoleUsers.forEach(async el => {
        el.role = DEFAULT_ROLE_ID as string;
        await el.save();
      });
    }

    await role.deleteOne({ id: role.id });

    return true;
  }
}

export default new AdminService();
