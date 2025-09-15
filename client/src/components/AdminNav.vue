<script setup>
  import { useAuthStore } from "@/stores/auth-store";
  import AvatarMini from "./AvatarMini.vue";
  import GroupMain from "./svg/GroupMain.vue";
  import HomeMain from "./svg/HomeMain.vue";
  import UsersMain from "./svg/UsersMain.vue";
  import ChartLine from "./svg/ChartLine.vue";

  const authStore = useAuthStore();
</script>

<template>
  <div class="admin-nav-wrapper">
    <nav class="admin-nav">
      <div class="admin-user">
        <RouterLink
          class="admin-user__link"
          :to="'/users/' + authStore.userData.nicknameSlug"
        >
          <AvatarMini
            :avatarUrl="authStore.userData?.avatarUrl"
            :nicknameFirstLetter="authStore.userData?.nickname?.at(0)"
          />{{ authStore.userData.nickname }}</RouterLink
        >
      </div>
      <div class="admin-nav__scroll">
        <h1 class="admin-nav__heading">Админ-панель</h1>
        <ul class="admin-nav__items">
          <li class="admin-nav__subitem">
            <RouterLink
              class="admin-nav__link"
              to="/admin"
              ><span><ChartLine class="icon" /></span
              ><span>Статистика</span></RouterLink
            >
          </li>
          <li class="admin-nav__subitem">
            <RouterLink
              class="admin-nav__link"
              to="/admin/manage-users"
              ><span><UsersMain class="icon" /></span
              ><span>Пользователи</span></RouterLink
            >
          </li>
          <li class="admin-nav__subitem">
            <RouterLink
              class="admin-nav__link"
              to="/admin/manage-roles"
              ><span><GroupMain class="icon" /></span
              ><span>Группы</span></RouterLink
            >
          </li>
          <li class="admin-nav__subitem admin-nav__subitem--home">
            <RouterLink
              class="admin-nav__link"
              to="/"
              ><span><HomeMain class="icon" /></span
              ><span>На главную сайта</span></RouterLink
            >
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<style scoped lang="scss">
  .icon {
    width: 24px;
    height: 24px;
  }

  .admin-user {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    padding: 8px 16px;
    background-color: #1e1d24;
    z-index: 2;

    &__link {
      display: flex;
      align-items: center;
      word-break: break-all;
    }
  }

  .admin-nav {
    position: fixed;
    width: 300px;
    top: 0px;
    bottom: 0px;
    background-color: #1e1d24;
    cursor: default;
    z-index: 999999;

    &__scroll {
      height: 100%;
      padding: 80px 20px;
      overflow-y: auto;
    }

    &__heading {
      width: 100%;
      top: 0px;
      left: 0;
      padding: 20px 0px;
      text-align: center;
      position: absolute;
      color: rgb(209, 190, 190);
      font-family: monospace;
      font-size: 24px;
      line-height: 24px;
      cursor: default;
      user-select: none;
      background-color: #1e1d24;
      z-index: 10;
    }

    &__admin {
      margin-top: 24px;
    }

    &__links-heading {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    &__subitem {
      position: relative;
      margin-top: 24px;
      margin-left: 30px;
      color: snow;
      font-size: 0.95em;

      &::before {
        position: absolute;
        content: "";
        width: 20px;
        height: 2px;
        top: 40%;
        left: -28px;
        background-color: orange;
      }

      &--home {
        margin-top: 80px;
      }
    }

    &__link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding-bottom: 8px;
      width: fit-content;
    }
  }
</style>
