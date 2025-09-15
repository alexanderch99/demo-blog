import $api from "../http/index.js";

class UserService {
  async getUserPublicInfo(nicknameSlug) {
    return $api.get(`/users/public-info/get/${nicknameSlug}`);
  }

  async updateUserPublicInfo(newUserPublicInfo, nicknameSlug) {
    return $api.patch(
      `/users/public-info/update/${nicknameSlug}`,
      newUserPublicInfo,
    );
  }

  async updateUserAvatar(data, nicknameSlug) {
    return $api.patch(`/users/avatar/update/${nicknameSlug}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export default new UserService();
