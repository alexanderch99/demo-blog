<script setup>
  import { RouterLink } from "vue-router";
  import ButtonText from "./UI/ButtonText.vue";
  import { useAuthStore } from "@/stores/auth-store";
  import authService from "@/services/auth-service";
  import DoorMain from "./svg/DoorMain.vue";
  import AvatarMini from "./AvatarMini.vue";
  import HomeMain from "./svg/HomeMain.vue";
  import LoginMain from "./svg/LoginMain.vue";

  import adminIcon from "@/assets/images/admin-icon.png";
  import BarsMain from "./svg/BarsMain.vue";
  import { ref } from "vue";

  const authStore = useAuthStore();

  const isMobileNavActive = ref(false);

  function checkIsAuthType() {
    if (typeof authStore.isAuth != "object") {
      return true;
    }
    return false;
  }

  function activeMobileNav() {
    if (!isMobileNavActive.value) {
      isMobileNavActive.value = true;
      document.body.style.overflow = "hidden";
    }
  }

  function hideMobileNav() {
    if (isMobileNavActive.value) {
      isMobileNavActive.value = false;
      document.body.style.overflow = "auto";
    }
  }

  async function logout() {
    hideMobileNav();
    await authService.logout();
    authStore.logOut();
    location.reload();
  }
</script>

<template>
  <header class="header">
    <div class="container header__container nav-container">
      <div class="header__bars">
        <BarsMain
          class="header__icon"
          @click="activeMobileNav"
        />
      </div>
      <div
        class="nav-wrapper"
        :class="{ active: isMobileNavActive }"
      >
        <div
          class="nav-wrapper__close"
          @click="hideMobileNav"
        >
          &times;
        </div>
        <nav class="nav">
          <ul class="nav__items">
            <li class="nav__item">
              <RouterLink
                class="nav__link"
                to="/"
                @click="hideMobileNav"
              >
                <HomeMain class="header__icon" />
              </RouterLink>
            </li>
            <li class="nav__item">
              <RouterLink
                v-if="authStore.isAuth && checkIsAuthType"
                class="nav__link"
                :to="`/users/${authStore.userData?.nicknameSlug}/blogs/`"
                @click="hideMobileNav"
                >Мои блоги</RouterLink
              >
            </li>
          </ul>
          <ButtonText class="profile notab">
            <RouterLink
              v-if="authStore.isAuth && checkIsAuthType"
              class="nav__link"
              :to="`/users/${authStore.userData?.nicknameSlug}`"
              @click="hideMobileNav"
            >
              <AvatarMini
                :avatarUrl="authStore.userData?.avatarUrl"
                :nicknameFirstLetter="authStore.userData?.nickname?.at(0)"
              />
              {{ authStore.userData?.nickname || "" }}</RouterLink
            >
            <RouterLink
              v-else
              class="nav__link"
              to="/auth"
              @click="hideMobileNav"
            >
              <LoginMain class="header__icon" /><span class="header__login-text"
                >Войти</span
              >
            </RouterLink>
          </ButtonText>
          <ButtonText v-if="authStore.userData?.role?.isAdmin">
            <RouterLink
              class="nav__link"
              to="/admin"
              @click="hideMobileNav"
            >
              <img
                :src="adminIcon"
                alt="admin-panel"
                class="header__admin-panel-icon"
            /></RouterLink>
          </ButtonText>
          <ButtonText
            v-if="authStore.isAuth"
            class="header__logout notab"
            @click="logout"
          >
            <DoorMain class="header__icon header__logout-icon" />
          </ButtonText>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
  .bars-container {
    display: none;

    @media (max-width: 999.98px) {
      display: block;
    }
  }

  .header {
    position: relative;
    width: 100%;
    background-color: #1e1d24;
    height: 80px;

    &__bars {
      display: none;
      user-select: none;

      @media (max-width: 999.98px) {
        display: block;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 8px;
        cursor: pointer;
      }
    }

    &__admin-panel-icon {
      width: 34px;
      height: 34px;
      filter: invert(1);
      margin-bottom: -4px;
    }

    &__login-text {
      margin-left: 8px;
    }

    &__logout {
      margin-left: 40px;

      @media (max-width: 999.98px) {
        margin: revert;
      }
    }

    &__container {
      height: 100%;
    }

    &__icon {
      width: 34px;
      height: 34px;
    }
  }

  .nav {
    position: relative;
    display: flex;
    height: 100%;

    &-wrapper {
      height: 100%;

      &__close {
        display: none;
      }
    }

    &-container {
      @media (max-width: 999.98px) {
        padding: 0;
      }
    }

    @media (max-width: 999.98px) {
      gap: 32px;

      &-wrapper {
        position: fixed;
        top: -200%;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: #1e1d24;
        z-index: 9999;
        transition: top 0.3s ease;

        &__close {
          display: block;
          position: absolute;
          top: 16px;
          right: 16px;
          font-size: 40px;
          cursor: pointer;
          z-index: 99999;
          user-select: none;
        }
      }

      &-wrapper.active {
        top: 0;
      }
    }

    @media (max-width: 999.98px) {
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    &__items {
      height: 100%;
      display: flex;
      align-items: center;
      gap: 40px;

      @media (max-width: 999.98px) {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: revert;
        margin: 0;
        gap: 32px;
      }
    }
  }

  .profile {
    margin-left: auto;
    display: flex;
    align-items: center;
    margin-right: 30px;

    @media (max-width: 999.98px) {
      margin: revert;
    }
  }

  .nav__link,
  .nav__item {
    height: 100%;
    display: flex;
    align-items: center;
    word-break: break-all;

    @media (max-width: 999.98px) {
      height: revert;
    }
  }
</style>
