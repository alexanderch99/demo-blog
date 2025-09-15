import { NextFunction, Request, Response } from "express";
import adminService from "../services/admin-service";

class AdminController {
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await adminService.getAllUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await adminService.getStats();
      res.json(stats);
    } catch (error) {
      next(error);
    }
  }

  async resetUserNickname(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.resetUserNickname(req.body.userId);
      res.json({ message: "Никнейм сброшен" });
    } catch (error) {
      next(error);
    }
  }

  async resetUserPublicInfo(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.resetUserPublicInfo(req.body.userId);
      res.json({ message: "Публичная информация профиля сброшена" });
    } catch (error) {
      next(error);
    }
  }

  async resetUserAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.resetUserAvatar(req.body.userId);
      res.json({ message: "Аватар сброшен" });
    } catch (error) {
      next(error);
    }
  }

  async userBan(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.userBan(req.body.userId, req.body.banExpires);
      res.json({ message: "Пользователь забанен" });
    } catch (error) {
      next(error);
    }
  }

  async userUnban(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.userUnban(req.body.userId);
      res.json({ message: "Пользователь разбанен" });
    } catch (error) {
      next(error);
    }
  }

  async changeUserRole(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.changeUserRole(req.body.userId, req.body.roleId);
      res.json({ message: "Группа изменена" });
    } catch (error) {
      next(error);
    }
  }

  async getAllRoles(req: Request, res: Response, next: NextFunction) {
    try {
      const roles = await adminService.getAllRoles();
      res.json(roles);
    } catch (error) {
      next(error);
    }
  }

  async createRole(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.createRole(req.body);
      res.json({ message: "Группа создана" });
    } catch (error) {
      next(error);
    }
  }

  async deleteRole(req: Request, res: Response, next: NextFunction) {
    try {
      await adminService.deleteRole(req.params.roleId);
      res.json({
        message: "Группа удалена",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AdminController();
