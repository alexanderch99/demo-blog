<script setup>
  import { ref, onMounted, computed } from "vue";

  import adminService from "@/services/admin-service";
  import handleAxiosError from "@/utils/handle-axios-error";
  import AvatarMini from "@/components/AvatarMini.vue";
  import formatDateTime from "@/utils/format-date";
  import ModalMain from "@/components/ModalMain.vue";
  import ProfileLink from "@/components/ProfileLink.vue";
  import ProfileInterest from "@/components/ProfileInterest.vue";
  import SpinnerMain from "@/components/UI/SpinnerMain.vue";

  import ManageUsersDo from "@/components/ManageUsersDo.vue";
  import ButtonMain from "@/components/UI/ButtonMain.vue";
  import InputMain from "@/components/UI/InputMain.vue";
  import toMilliseconds from "@/utils/to-milliseconds";

  const isUsersLoaded = ref(false);
  const users = ref([]);
  const roles = ref([]);
  const userDataMoreInfo = ref({});
  const userDataBan = ref({});
  const userDataRole = ref({});

  const banTime = ref({
    type: "days",
    time: "7",
  });

  const newRole = ref("");

  const banTypeC = {
    minutes: "мин.",
    hours: "ч.",
    days: "дн.",
    months: "мес.",
    years: "лет",
  };

  async function getAllUsers() {
    try {
      const response = await adminService.getAllUsers();

      users.value = response.data;
    } catch (error) {
      handleAxiosError(error);
    } finally {
      isUsersLoaded.value = true;
    }
  }

  async function getAllRoles() {
    try {
      const response = await adminService.getAllRoles();

      roles.value = response.data;
    } catch (error) {
      handleAxiosError(error);
    }
  }

  function showMoreUserInfo(user) {
    userDataMoreInfo.value = user;
  }

  function hideMoreUserInfo() {
    userDataMoreInfo.value = {};
  }

  function showBanForm(user) {
    userDataBan.value = user;
  }

  function hideBanForm() {
    userDataBan.value = {};
  }

  async function resetUserNickname(userId) {
    try {
      const response = await adminService.resetUserNickname(userId);
      await getAllUsers();
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async function resetUserPublicInfo(userId) {
    try {
      const response = await adminService.resetUserPublicInfo(userId);
      await getAllUsers();
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async function resetUserAvatar(userId) {
    try {
      const response = await adminService.resetUserAvatar(userId);
      await getAllUsers();
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async function userBan(userId) {
    const banExpires =
      toMilliseconds({
        [banTime.value.type]: banTime.value.time,
      }) + Date.now();
    try {
      const response = await adminService.userBan(userId, banExpires);
      await getAllUsers();
      hideBanForm();
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async function userUnban(userId) {
    try {
      const response = await adminService.userUnban(userId);
      console.log(response.data);
      await getAllUsers();
      hideBanForm();
    } catch (error) {
      handleAxiosError(error);
    }
  }

  function showRoleForm(user) {
    userDataRole.value = user;
  }

  function hideRoleForm() {
    userDataRole.value = {};
    newRole.value = "";
  }

  async function changeUserRole(userId) {
    try {
      const response = await adminService.changeUserRole(userId, newRole.value);
      await getAllUsers();
      hideRoleForm();
    } catch (error) {
      handleAxiosError(error);
    }
  }

  onMounted(() => {
    getAllUsers();
    getAllRoles();
  });
</script>

<template>
  <Teleport to="#modals">
    <ModalMain
      v-if="userDataMoreInfo.id"
      @closeModal="hideMoreUserInfo"
    >
      <div class="more-info">
        <div class="more-info__item">
          <p class="more-info__heading">Пользователь</p>
          <p class="more-info__info">
            {{ userDataMoreInfo.nickname }} / {{ userDataMoreInfo.id }} /
            {{ userDataMoreInfo.idSimple }} /
            {{ userDataMoreInfo.nicknameSlug }}
          </p>
        </div>
        <div class="more-info__item">
          <p class="more-info__heading">Краткое описание</p>
          <p class="more-info__info">{{ userDataMoreInfo.bio }}</p>
        </div>
        <div class="more-info__item">
          <p class="more-info__heading">Место жительства</p>
          <p class="more-info__info">{{ userDataMoreInfo.location }}</p>
        </div>
        <div class="more-info__item">
          <p class="more-info__heading">Контакты</p>
          <p class="more-info__info more-info__links">
            <ProfileLink
              class="more-info__link"
              v-for="link in userDataMoreInfo.links"
              :key="link.link"
              :link="link"
            />
          </p>
        </div>
        <div class="more-info__item">
          <p class="more-info__heading">Интересы</p>
          <p class="more-info__info more-info__interests">
            <ProfileInterest
              class="more-info__interest"
              v-for="interest in userDataMoreInfo.interests"
              :key="interest"
              :interest="interest"
            />
          </p>
        </div>
        <div class="more-info__item">
          <p class="more-info__heading">Последнее изменение</p>
          <p class="more-info__info">
            {{ formatDateTime(userDataMoreInfo.updatedAt) }}
          </p>
        </div>
      </div>
    </ModalMain>
    <ModalMain
      v-if="userDataBan.id"
      @closeModal="hideBanForm"
    >
      <div
        class="user-ban-status"
        v-if="!userDataBan.banExpires || userDataBan.banExpires == 'none'"
      >
        Пользователь '{{ userDataBan.nickname }}' не забанен
      </div>
      <div
        v-else
        class="user-ban-status"
      >
        Пользователь '{{ userDataBan.nickname }}' забанен до
        {{
          formatDateTime(
            new Date(Number(userDataBan.banExpires) || 0).toISOString(),
          )
        }}
        <ButtonMain
          class="user-ban-status__unban"
          @click="userUnban(userDataBan.id)"
          >Разбанить</ButtonMain
        >
      </div>
      <form
        action="#"
        class="ban-form"
        @submit.prevent
      >
        <label
          for="ban"
          class="ban-form__label"
          >Выбор срока блокировки: на
        </label>
        <InputMain
          placeholder="1-999"
          class="ban-form__input"
          v-model="banTime.time"
          v-numeric
        />
        <select
          name="ban"
          id="ban"
          class="ban-form__select admin-form-select"
          v-model="banTime.type"
        >
          <option
            value="minutes"
            class="ban-form__option admin-form-option"
          >
            минут
          </option>
          <option
            value="hours"
            class="ban-form__option admin-form-option"
          >
            часов
          </option>
          <option
            value="days"
            class="ban-form__option admin-form-option"
          >
            дней
          </option>
          <option
            value="months"
            class="ban-form__option admin-form-option"
          >
            месяцев
          </option>
          <option
            value="years"
            class="ban-form__option admin-form-option"
          >
            лет
          </option>
        </select>
        <ButtonMain
          class="ban-form__ban"
          @click="userBan(userDataBan.id)"
          >Забанить пользователя '{{ userDataBan.nickname }}' на
          {{ banTime.time }} {{ banTypeC[banTime.type] }}</ButtonMain
        >
      </form>
    </ModalMain>
    <ModalMain
      v-if="userDataRole.id"
      @closeModal="hideRoleForm"
    >
      <div class="user-role-status">
        Группа пользователя '{{ userDataRole.nickname }}': '{{
          userDataRole.role?.displayName
        }}'
      </div>
      <form
        action="#"
        class="role-form"
        @submit.prevent
      >
        <select
          name="role"
          id="role"
          class="role-form__select admin-form-select"
          v-model="newRole"
        >
          <option
            disabled
            value=""
          >
            Выбрать новую группу
          </option>
          <option
            class="role-form__option admin-form-option"
            v-for="role in roles"
            :value="role.id"
          >
            {{ role.displayName }} ({{ role.priority }} | {{ role.name
            }}{{ role.isAdmin ? " | Администратор" : "" }})
          </option>
        </select>
        <ButtonMain
          class="role-form__change-role"
          @click="changeUserRole(userDataRole.id)"
          :disabled="!newRole"
          >Сменить группу пользователя '{{ userDataRole.nickname }}' на
          {{
            newRole
              ? "'" + roles.find(el => el.id == newRole)?.displayName + "'"
              : "..."
          }}</ButtonMain
        >
      </form>
    </ModalMain>
  </Teleport>
  <div class="users">
    <Transition name="fade">
      <SpinnerMain
        v-if="!isUsersLoaded"
        class="users__spinner"
        size="80px"
    /></Transition>
    <template v-if="isUsersLoaded">
      <div
        class="user"
        v-for="user in users"
        :key="user.id"
      >
        <div class="user__who">
          <AvatarMini
            class="user__avatar"
            :avatarUrl="user.avatarUrl"
            :nicknameFirstLetter="user.nickname?.at(0)"
          />
          <p class="user__id">{{ user.id }} ({{ user.idSimple }})</p>
          <p class="user__login">{{ user.email }}</p>
          <p class="user__nickname">
            {{ user.nickname }}
          </p>
          <p class="user__role">{{ user.role?.displayName }}</p>
          <p class="user__join">
            Регистрация: {{ formatDateTime(user.createdAt) }}
          </p>
        </div>
        <ManageUsersDo
          :user="user"
          @showMoreUserInfo="showMoreUserInfo"
          @resetUserNickname="resetUserNickname"
          @resetUserPublicInfo="resetUserPublicInfo"
          @resetUserAvatar="resetUserAvatar"
          @showBanForm="showBanForm"
          @showRoleForm="showRoleForm"
        />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .admin-form-select {
    background-color: #1c1b22;
    padding: 6px 12px;
    color: rgb(209, 190, 190);
    font-size: 18px;
    line-height: 18px;
    border-radius: 8px;
    cursor: pointer;
  }

  .user-ban-status {
    margin-bottom: 20px;
    text-align: center;

    @media (max-width: 999.98px) {
      font-size: 0.8em;
    }

    &__unban {
      margin-top: 20px;
    }
  }

  .user-role-status {
    margin-bottom: 20px;
    text-align: center;

    @media (max-width: 999.98px) {
      font-size: 0.8em;
    }
  }

  .role-form {
    margin-top: 80px;
    font-family: monospace;
    text-align: center;

    @media (max-width: 999.98px) {
      font-size: 0.8em;
    }

    &__select,
    &__change-role {
      width: 100%;
    }

    &__change-role {
      margin-top: 20px;
    }

    &__select {
      font-size: 0.8em;
    }
  }

  .ban-form {
    margin-top: 80px;
    font-family: monospace;
    text-align: center;

    @media (max-width: 999.98px) {
      font-size: 0.8em;
    }

    &__ban {
      width: 100%;
      margin-top: 20px;
    }

    &__label {
      color: rgb(209, 190, 190);
      font-size: 18px;
      line-height: 18px;

      @media (max-width: 999.98px) {
        font-size: 0.8em;
      }
    }

    &__input {
      width: 80px !important;
      padding: 6px 12px !important;
      margin: 0px 12px;
      font-size: 18px;
      line-height: 18px;

      @media (max-width: 999.98px) {
        font-size: 0.8em;

        padding: 4px 8px !important;
        margin: 0px 6px;
      }
    }

    &__select {
      @media (max-width: 999.98px) {
        font-size: 0.8em;
      }
    }
  }

  .more-info {
    @media (max-width: 999.98px) {
      font-size: 0.8em;
    }

    &__item:not(:first-child) {
      margin-top: 32px;
    }

    &__heading {
      margin-left: 2px;
      color: rgb(209, 190, 190);
    }

    &__info {
      margin-top: 8px;
      padding: 8px;
      border-radius: 8px;
      background-color: #56555e;
    }

    &__links,
    &__interests {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      background-color: revert;
      padding: 0px;
    }
  }

  .users {
    position: relative;
    display: flex;
    align-items: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    min-height: calc(
      100vh - var(--footer-height) - var(--admin-page-padding) * 2
    );

    &__spinner {
      inset: -8px;
      border-radius: 16px;
    }
  }

  .user {
    position: relative;
    flex-grow: 0;
    flex-shrink: 0;
    padding: 16px 8px;
    border-radius: 16px;
    border: 2px solid darkslategray;
    font-size: 18px;
    line-height: 18px;
    font-family: monospace;
    color: rgba(209, 190, 190);

    @media (max-width: 999.98px) {
      font-size: 0.75em;
      flex-grow: 1;
    }

    @media (max-width: 499.98px) {
      font-size: 0.6em;
    }

    &__do {
      margin-top: 20px;
      font-size: 16px;
      line-height: 16px;
    }

    &__who {
      position: relative;
      display: grid;
      grid-template: auto / 144px 560px;
      column-gap: 16px;
      align-items: center;

      @media (max-width: 999.98px) {
        grid-template: auto / 96px 1fr;
      }
    }

    &__avatar {
      width: 144px;
      height: 144px;
      border-radius: 16px;
      grid-row: span 5;
      border: 2px solid #1e1d24;

      @media (max-width: 999.98px) {
        width: 96px;
        height: 96px;
      }

      > * {
        font-size: 100px;
        line-height: 100px;

        @media (max-width: 999.98px) {
          font-size: 64px;
          line-height: 64px;
        }
      }
    }
  }
</style>
