import $api from "../http/index.js";

class AuthService {
  async login(username, password) {
    return $api.post("/auth/login", {
      email: username,
      password,
    });
  }

  async registration(username, password) {
    return $api.post("/auth/registration", {
      email: username,
      password,
    });
  }

  async logout() {
    return $api.get("/auth/logout");
  }

  async verify() {
    return $api.get("/auth/verify");
  }
}

export default new AuthService();
