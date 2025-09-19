<script setup>
  import { ref, Transition } from "vue";
  import handleAxiosError from "@/utils/handle-axios-error";
  import userService from "@/services/user-service";
  import { useAuthStore } from "@/stores/auth-store";
  import ProfileLink from "./ProfileLink.vue";
  import ProfileInterest from "./ProfileInterest.vue";
  import LocationMain from "./svg/LocationMain.vue";
  import UserBio from "./svg/UserBio.vue";
  import EditImgForm from "./EditImgForm.vue";
  import ButtonEdit from "./UI/ButtonEdit.vue";
  import SpinnerMain from "./UI/SpinnerMain.vue";
  import { useRoute } from "vue-router";
  import UserBlogsView from "@/views/UserBlogsView.vue";
  import formatDateTime from "@/utils/format-date";
  import { useGlobalNotificationStore } from "@/stores/global-notification-store";

  const authStore = useAuthStore();
  const globalNotificationStore = useGlobalNotificationStore();

  const route = useRoute();

  const { userPublicInfo, isMyProfile } = defineProps([
    "userPublicInfo",
    "isMyProfile",
  ]);
  const emit = defineEmits(["openModal", "updateAvatar"]);

  function openModalHC() {
    emit("openModal");
  }

  const isAvatarSelected = ref(false);
  const isAvatarLoading = ref(false);
  const previewAvatarSrc = ref("");

  let formData = null;

  async function avatarUpload() {
    try {
      isAvatarLoading.value = true;
      const payload = await userService.updateUserAvatar(
        formData,
        route.params.nicknameSlug,
      );
      authStore.logIn(payload.data);
      cancelAvatarUpload();
      emit("updateAvatar");
      globalNotificationStore.showNotification("Аватар обновлен");
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    } finally {
      setTimeout(() => {
        isAvatarLoading.value = false;
      }, 1000);
    }
  }

  function cancelAvatarUpload() {
    formData = null;
    isAvatarSelected.value = false;
    URL.revokeObjectURL(previewAvatarSrc.value);
    previewAvatarSrc.value = "";
  }

  async function startAvatarUpload(et) {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    isAvatarSelected.value = true;

    formData = new FormData();
    const avatar = et.files[0];

    formData.append("avatar", avatar);
    formData.append("id", authStore.userData.id);
    formData.append("ttest", "dasdassad");

    previewAvatarSrc.value = URL.createObjectURL(avatar);
  }

  async function delAvatar() {
    if (typeof authStore.isAuth == "object") {
      await authStore.isAuth;
    }

    formData = new FormData();
    const avatar = null;

    formData.append("avatar", avatar);
    formData.append("type", "delete");
    formData.append("id", authStore.userData.id);

    try {
      const payload = await userService.updateUserAvatar(
        formData,
        route.params.nicknameSlug,
      );
      authStore.logIn(payload.data);
      cancelAvatarUpload();
      emit("updateAvatar");
      globalNotificationStore.showNotification("Аватар удален");
    } catch (error) {
      handleAxiosError(error, globalNotificationStore.showNotification);
    }
  }
</script>

<template>
  <div
    class="user"
    v-bind="$attrs"
  >
    <ButtonEdit
      v-if="isMyProfile"
      class="user__edit"
      @click="openModalHC"
    />
    <div class="user__avatar user__item">
      <div
        v-if="isAvatarSelected && isMyProfile && !isAvatarLoading"
        class="user__avatar-preview-mark"
      >
        предпросмотр
      </div>
      <div
        v-if="!isAvatarSelected && isMyProfile && !isAvatarLoading"
        class="user__avatar-upload-rules"
      >
        <p>от&nbsp;288x288&nbsp;(рекомендуется)</p>
        <p>не&nbsp;более&nbsp;2&nbsp;мегабайт</p>
      </div>
      <div
        v-if="
          !userPublicInfo.avatarUrl ||
          (userPublicInfo.avatarUrl == 'none' && !previewAvatarSrc)
        "
        class="user__no-avatar"
      >
        {{ userPublicInfo.nickname?.at(0) }}
      </div>
      <img
        v-if="
          userPublicInfo.avatarUrl &&
          userPublicInfo.avatarUrl != 'none' &&
          !previewAvatarSrc
        "
        :src="userPublicInfo.avatarUrl"
        alt="avatar"
        class="user__avatar-img"
      />
      <img
        v-if="isAvatarSelected"
        :src="previewAvatarSrc"
        alt="preview"
        class="user__avatar-preview"
      />
      <Transition name="fade">
        <SpinnerMain
          v-if="isAvatarLoading"
          size="120px"
          class="user__avatar-loading"
      /></Transition>
      <EditImgForm
        class="edit-avatar-form"
        :isMyObject="isMyProfile"
        :imgUrl="userPublicInfo.avatarUrl"
        :isImgSelected="isAvatarSelected"
        :isImgLoading="isAvatarLoading"
        forImg="avatar"
        @startImgUpload="startAvatarUpload"
        @delImg="delAvatar"
        @imgUpload="avatarUpload"
        @cancelImgUpload="cancelAvatarUpload"
      />
    </div>
    <div class="user__info user__item">
      <div class="user__nickname-and-role user__subitem">
        <p class="user__nickname">{{ userPublicInfo.nickname }}</p>
        <p
          v-if="userPublicInfo.role?.name != 'default'"
          class="user__role"
        >
          {{ userPublicInfo.role?.displayName }}
        </p>
        <p
          v-if="
            userPublicInfo.banExpires && userPublicInfo.banExpires != 'none'
          "
          class="user__role"
        >
          бан до
          {{
            formatDateTime(
              new Date(Number(userPublicInfo.banExpires) || 0).toISOString(),
            )
          }}
        </p>
      </div>
      <p
        v-if="userPublicInfo.bio && userPublicInfo.bio != 'none'"
        class="user__bio user__subitem"
      >
        <span> <UserBio class="user__icon user__bio-icon" /> </span>
        {{ userPublicInfo.bio }}
      </p>
      <div
        v-if="userPublicInfo.location && userPublicInfo.location != 'none'"
        class="user__location user__subitem"
      >
        <span> <LocationMain class="user__icon user__location-icon" /> </span>
        <p class="user__location-text">
          {{ userPublicInfo.location }}
        </p>
      </div>
      <div
        v-if="userPublicInfo.links && userPublicInfo.links.length"
        class="user__links-wrapper user__subitem"
      >
        <p class="user__links-heading">Контакты</p>
        <div class="user__links">
          <div
            class="user__link"
            v-for="link in userPublicInfo.links"
            :key="link.link"
          >
            <ProfileLink :link="link" />
          </div>
        </div>
      </div>
      <div
        v-if="userPublicInfo.interests && userPublicInfo.interests.length"
        class="user__interests-wrapper user__subitem"
      >
        <p class="user__interests-heading">Интересы</p>
        <div class="user__interests">
          <div
            class="user__interest"
            v-for="interest in userPublicInfo.interests"
            :key="interest"
          >
            <ProfileInterest :interest="interest" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="user-blogs">
    <UserBlogsView />
  </div>
</template>

<style scoped lang="scss">
  .user-blogs {
    &__heading {
      margin-top: 100px;
    }
  }

  .edit-avatar-form {
    position: absolute;
    bottom: -60px;
    left: 0;
  }

  .user {
    display: flex;
    gap: 60px;
    position: relative;
    word-break: break-all;
    margin-bottom: 100px;

    @media (max-height: 799.98px) {
      flex-direction: column;
    }

    &__icon {
      width: 20px;
      height: 20px;
    }

    &__bio,
    &__location {
      font-size: 18px;
      line-height: 22px;
      letter-spacing: 0.8px;
    }

    &__location {
      display: flex;
      align-items: center;
      gap: 4px;

      &-text {
        position: relative;
        top: 2px;
      }
    }

    &__links,
    &__interests {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      &-heading {
        margin-bottom: 8px;
        margin-left: 2px;
        font-size: 20px;
        line-height: 24px;
        letter-spacing: 0.4px;
      }
    }

    &__role {
      background-color: #1e1d24;
      padding: 6px 16px;
      border-radius: 20px;
      font-family: monospace;
      font-size: 18px;
      line-height: 18px;
      color: rgb(160, 160, 160);
      cursor: default;
    }

    &__nickname {
      font-size: 30px;
      font-weight: 700;
    }

    &__nickname-and-role {
      display: flex;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 30px;
      padding-right: 48px;

      @media (max-height: 799.98px) {
        flex-direction: column;
        justify-content: center;
        padding-right: 0px;
      }
    }

    & &__edit {
      position: absolute;
      top: 38px;
      right: 20px;

      @media (max-width: 999.98px) {
        > * {
          top: -6px;
        }
      }
    }

    &__subitem {
      margin-top: 20px;
    }

    &__links-wrapper {
      margin-top: 40px;
    }

    &__no-avatar {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 144px;
      color: gray;
    }

    &__avatar {
      position: relative;
      width: 288px;
      height: 288px;
      border-radius: 30px;
      flex-grow: 0;
      flex-shrink: 0;
      background-color: transparent;
      outline: 4px solid #1e1d24;

      &-preview-mark,
      &-upload-rules {
        position: absolute;
        bottom: -48px;
        left: 68px;
        font-family: monospace;
        font-size: 16px;
        line-height: 16px;
        color: gray;
      }

      &-upload-rules {
        bottom: -56px;
        left: 46px;
        display: flex;
        flex-direction: column;
        font-size: 14px;
        line-height: 18px;
      }

      &-img,
      &-preview {
        position: relative;
        z-index: 10;
        width: inherit;
        height: inherit;
        border-radius: inherit;
        object-fit: cover;
        font-size: 0px;
      }

      &-preview {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 11;
      }
    }
  }
</style>
