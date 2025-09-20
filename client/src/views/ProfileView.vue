<script setup>
  import { onMounted, ref } from "vue";
  import UserInProfile from "@/components/UserInProfile.vue";
  import userService from "@/services/user-service";
  import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
  import { useAuthStore } from "@/stores/auth-store";
  import handleAxiosError from "@/utils/handle-axios-error";
  import ModalMain from "@/components/ModalMain.vue";
  import ProfileEdit from "@/components/ProfileEdit.vue";
  import { useGlobalNotificationStore } from "@/stores/global-notification-store";

  const authStore = useAuthStore();
  const globalNotificationStore = useGlobalNotificationStore();

  const route = useRoute();
  const router = useRouter();

  const userPublicInfo = ref({});
  const isMyProfile = ref(false);
  const isModalOpen = ref(false);

  function openModal() {
    isModalOpen.value = true;
  }

  function closeModal() {
    isModalOpen.value = false;
  }

  async function getUserPublicInfo(nicknameSlug) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    if (
      authStore.userData.nicknameSlug ==
      (nicknameSlug || route.params.nicknameSlug)
    ) {
      userPublicInfo.value = authStore.userData;
      isMyProfile.value = true;
      return true;
    }

    try {
      const response = await userService.getUserPublicInfo(
        nicknameSlug || route.params.nicknameSlug,
      );
      userPublicInfo.value = response.data;
      isMyProfile.value = false;
    } catch (error) {
      router.push("/404");
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  async function updateUserPublicInfo(newUserInfo) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    let { nickname, bio, location, links, interests, avatarUrl } = newUserInfo;

    if (nickname == null || !nickname) nickname = authStore.userData.nickname;

    if (bio == null || !bio) bio = "none";

    if (location == null || !location) location = "none";

    if (links == null || !links || !links.length) links = [];

    if (interests == null || !interests || !interests.length) interests = [];

    if (avatarUrl == null || !avatarUrl) avatarUrl = "none";

    try {
      const payload = await userService.updateUserPublicInfo(
        {
          id: authStore.userData.id,
          nickname,
          bio,
          location,
          links,
          interests,
          avatarUrl,
        },
        route.params.nicknameSlug,
      );
      authStore.logIn(payload.data);
      const nicknameSlug = payload.data.nicknameSlug;
      await getUserPublicInfo(nicknameSlug);
      router.push(`/users/${nicknameSlug}`);
      closeModal();
      globalNotificationStore.showNotification("Информация профиля обновлена");
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }

  onMounted(async () => {
    await getUserPublicInfo();
  });

  onBeforeRouteUpdate(async (to, from) => {
    await getUserPublicInfo(to.params.nicknameSlug);
  });
</script>

<template>
  <Teleport to="#modals">
    <ModalMain
      v-if="isModalOpen"
      @closeModal="closeModal"
    >
      <ProfileEdit
        :userPublicInfo="userPublicInfo"
        @closeModal="closeModal"
        @updateUserPublicInfo="updateUserPublicInfo"
      />
    </ModalMain>
  </Teleport>
  <div class="container">
    <UserInProfile
      class="user-in-profile"
      :userPublicInfo="userPublicInfo"
      :isMyProfile="isMyProfile"
      @openModal="openModal"
      @updateAvatar="getUserPublicInfo"
    />
  </div>
</template>

<style scoped></style>
