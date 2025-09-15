import { ref } from "vue";
import { defineStore } from "pinia";

import handleAxiosError from "@/utils/handle-axios-error";
import authService from "@/services/auth-service";
import formatDateTime from "@/utils/format-date";

export const useAuthStore = defineStore("auth", () => {
  const isAuth = ref(
    new Promise(async (resolve, reject) => {
      try {
        await verify();
        resolve(1);
      } catch (error) {
        reject();
      }
    }),
  );
  const userData = ref({});

  function logIn(payload) {
    userData.value = JSON.parse(JSON.stringify(payload));
    isAuth.value = true;
    return true;
  }

  function logOut() {
    userData.value = {};
    isAuth.value = false;
  }

  async function verify() {
    try {
      const response = await authService.verify();
      const payload = response.data;

      if (payload.banExpires && payload.banExpires != "none") {
        console.warn(
          `Вы забанены до ${formatDateTime(
            new Date(Number(payload.banExpires) || 0).toISOString(),
          )}`,
        );
      }

      return logIn(payload);
    } catch (error) {
      handleAxiosError(error);
      return logOut();
    }
  }

  return { isAuth, userData, logIn, logOut };
});
