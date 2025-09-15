import $api from "../http/index.js";

class AdminService {
  async getAllUsers() {
    return $api.get("/admin/all-users/get");
  }

  async getStats() {
    return $api.get("/admin/stats/get");
  }

  async resetUserNickname(userId) {
    return $api.patch("/admin/user-nickname/reset", {
      userId,
    });
  }

  async resetUserPublicInfo(userId) {
    return $api.patch("/admin/user-public-info/reset", {
      userId,
    });
  }

  async resetUserAvatar(userId) {
    return $api.patch("/admin/user-avatar/reset", {
      userId,
    });
  }

  async userBan(userId, banExpires) {
    return $api.patch("/admin/user/ban", {
      userId,
      banExpires,
    });
  }

  async userUnban(userId) {
    return $api.patch("/admin/user/unban", {
      userId,
    });
  }

  async changeUserRole(userId, roleId) {
    return $api.patch("/admin/user-role/update", {
      userId,
      roleId,
    });
  }

  async getAllRoles() {
    return $api.get("/admin/all-roles/get");
  }

  async createRole(name, displayName, priority, isAdmin) {
    return $api.post("/admin/role/create", {
      name,
      displayName,
      priority,
      isAdmin,
    });
  }

  async deleteRole(roleId) {
    return $api.delete(`/admin/role/delete/${roleId}`);
  }
}

export default new AdminService();
