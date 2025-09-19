<script setup>
  import { ref } from "vue";
  import ButtonMain from "./UI/ButtonMain.vue";
  import ArrowRightAngle from "@/components/svg/ArrowRightAngle.vue";

  const { user } = defineProps(["user"]);
  const emit = defineEmits([
    "showMoreUserInfo",
    "resetUserNickname",
    "resetUserPublicInfo",
    "resetUserAvatar",
    "showBanForm",
    "showRoleForm",
  ]);

  const isDoActive = ref(false);

  function showMoreUserInfoHC(user) {
    emit("showMoreUserInfo", user);
  }

  function resetUserNicknameHC(userId) {
    emit("resetUserNickname", userId);
  }

  function resetUserPublicInfoHC(userId) {
    emit("resetUserPublicInfo", userId);
  }

  function resetUserAvatarHC(userId) {
    emit("resetUserAvatar", userId);
  }

  function showBanFormHC(user) {
    emit("showBanForm", user);
  }

  function showRoleFormHC(user) {
    emit("showRoleForm", user);
  }
</script>

<template>
  <div class="user-do-wrapper">
    <div
      class="user-do"
      :class="{ active: isDoActive }"
    >
      <div>
        <ButtonMain
          class="user-do__button"
          @click="showMoreUserInfoHC(user)"
          >Больше информации</ButtonMain
        >
        <RouterLink
          :to="`/users/${user.nicknameSlug}`"
          target="_blank"
        >
          <ButtonMain class="user-do__button"
            >Перейти в профиль</ButtonMain
          ></RouterLink
        >
        <ButtonMain
          class="user-do__button"
          @click="showBanFormHC(user)"
          >Бан и разбан</ButtonMain
        >
        <ButtonMain
          class="user-do__button"
          @click="showRoleFormHC(user)"
          >Изменить группу</ButtonMain
        >
        <ButtonMain
          class="user-do__button"
          :disabled="user.nickname == user.id"
          @click="resetUserNicknameHC(user.id)"
          >Удалить никнейм</ButtonMain
        >
        <ButtonMain
          class="user-do__button"
          :disabled="
            user.bio == 'none' &&
            user.location == 'none' &&
            !user.links?.length &&
            !user.interests?.length
          "
          @click="resetUserPublicInfoHC(user.id)"
          >Удалить публичную информацию</ButtonMain
        >
        <ButtonMain
          class="user-do__button"
          :disabled="!user.avatarUrl || user.avatarUrl == 'none'"
          @click="resetUserAvatarHC(user.id)"
          >Удалить аватар</ButtonMain
        >
        <ButtonMain
          class="user-do__button"
          disabled
          >Удалить пользователя</ButtonMain
        >
      </div>
    </div>
    <div
      class="user-toggle-do"
      @click="isDoActive = !isDoActive"
    >
      <ArrowRightAngle
        class="user-toggle-do__icon"
        :class="{ active: isDoActive }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .user-toggle-do {
    position: absolute;
    bottom: 8px;
    right: 8px;
    background-color: #1e1d24;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    @media (max-width: 799.98px) {
      width: 32px;
      height: 32px;
    }

    &__icon {
      width: 28px;
      height: 28px;
      transition: all 0.3s ease;
      cursor: pointer;
      transform: rotate(90deg);

      @media (max-width: 799.98px) {
        width: 24px;
        height: 24px;
      }

      &.active {
        transform: rotate(-90deg);
      }
    }
  }

  .user-do {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition: all 0.3s ease;

    > div {
      overflow-x: hidden;
      overflow-y: hidden;
    }

    &.active {
      grid-template-rows: 1fr;
      opacity: 1;
    }

    &__button {
      width: 99%;
      margin-top: 10px;

      @media (max-height: 999.98px) {
        font-size: 1em;
      }
    }
  }

  .user-do-wrapper {
    padding-bottom: 40px;
  }
</style>
