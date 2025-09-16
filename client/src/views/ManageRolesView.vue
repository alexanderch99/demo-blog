<script setup>
  import ModalMain from "@/components/ModalMain.vue";
  import LockMain from "@/components/svg/LockMain.vue";
  import ButtonAddNew from "@/components/UI/ButtonAddNew.vue";
  import ButtonDel from "@/components/UI/ButtonDel.vue";
  import ButtonMain from "@/components/UI/ButtonMain.vue";
  import InputMain from "@/components/UI/InputMain.vue";
  import SpinnerMain from "@/components/UI/SpinnerMain.vue";
  import adminService from "@/services/admin-service";
  import handleAxiosError from "@/utils/handle-axios-error";
  import { onMounted, ref } from "vue";

  const roles = ref([]);

  const isRolesLoaded = ref(false);
  const isNewRoleCreating = ref(false);
  const newRole = ref({
    name: "",
    displayName: "",
    priority: "",
    isAdmin: false,
  });

  async function getAllRoles() {
    try {
      const response = await adminService.getAllRoles();
      roles.value = response.data;
    } catch (error) {
      handleAxiosError(error);
    } finally {
      isRolesLoaded.value = true;
    }
  }

  function startNewRoleCreating() {
    isNewRoleCreating.value = true;
  }

  function cancelNewRoleCreating() {
    newRole.value = {
      name: "",
      displayName: "",
      priority: "",
      isAdmin: false,
    };
    isNewRoleCreating.value = false;
  }

  async function createRole() {
    try {
      const response = await adminService.createRole(
        newRole.value.name,
        newRole.value.displayName,
        newRole.value.priority,
        newRole.value.isAdmin,
      );

      await getAllRoles();
      cancelNewRoleCreating();
    } catch (error) {
      handleAxiosError(error);
    }
  }

  async function deleteRole(roleId) {
    if (
      !confirm(
        "Это приведет к удалению группы, а все ее пользователи будут перемещены в группу default",
      )
    ) {
      return false;
    }
    try {
      const response = await adminService.deleteRole(roleId);
      console.log(response.data);
      await getAllRoles();
    } catch (error) {
      handleAxiosError(error);
    }
  }

  onMounted(() => {
    getAllRoles();
  });
</script>

<template>
  <Teleport to="#modals">
    <ModalMain
      v-if="isNewRoleCreating"
      @closeModal="cancelNewRoleCreating"
    >
      <form
        action="#"
        class="new-role-form"
        @submit.prevent
      >
        <div class="new-role-form__item">
          <InputMain
            name="new-role-name"
            id="new-role-name"
            placeholder="Техническое название группы (например user)"
            maxlength="32"
            v-model="newRole.name"
          />
          <div class="form-count">1 / {{ newRole.name?.length }} / 32</div>
        </div>
        <div class="new-role-form__item">
          <InputMain
            name="new-role-displayname"
            id="new-role-displayname"
            placeholder="Отображаемое название группы (например Пользователь)"
            maxlength="32"
            v-model="newRole.displayName"
          />
          <div class="form-count">
            1 / {{ newRole.displayName?.length }} / 32
          </div>
        </div>
        <div class="new-role-form__item">
          <InputMain
            name="new-role-priority"
            id="new-role-priority"
            placeholder="Приоритет группы (от 12 до 98)"
            v-model="newRole.priority"
            v-numeric
          />
        </div>
        <div class="new-role-form__item">
          <p>Права администратора?</p>
          <div class="new-role-form__is-admin">
            <div>
              <label for="new-role-noadmin">Нет</label>
              <input
                type="radio"
                name="new-role-noadmin"
                id="new-role-noadmin"
                :value="false"
                v-model="newRole.isAdmin"
              />
            </div>
            <div>
              <input
                type="radio"
                name="new-role-admin"
                id="new-role-admin"
                :value="true"
                v-model="newRole.isAdmin"
              />
              <label for="new-role-admin">Да</label>
            </div>
          </div>
        </div>
        <ButtonMain
          class="new-role-form__submit"
          @click="createRole"
          >Создать группу {{ newRole.priority ? newRole.priority + " |" : "" }}
          {{ newRole.name }}
          {{
            newRole.displayName ? "(" + newRole.displayName + ")" : ""
          }}</ButtonMain
        >
      </form>
    </ModalMain>
  </Teleport>
  <div class="roles">
    <Transition name="fade">
      <SpinnerMain
        v-if="!isRolesLoaded"
        class="roles__spinner"
        size="80px"
    /></Transition>
    <div
      v-if="isRolesLoaded"
      class="role"
      v-for="role in roles"
      :key="role.id"
      :class="{ secured: role.secured }"
      :style="{ paddingRight: role.secured ? '16px' : '70px' }"
    >
      <span
        v-if="role.secured"
        class="role__icon-wrapper"
        ><LockMain class="role__icon role__icon--lock"
      /></span>
      <span class="role__name"
        ><span
          :style="{ color: `rgba(250,250,250,${0.2 + role.priority / 100})` }"
          >{{ role.priority }}</span
        >
        | {{ role.name }} ({{ role.displayName }})</span
      >
      <div
        v-if="!role.secured"
        class="role__control"
      >
        <ButtonDel
          class="role__del"
          @click="deleteRole(role.id)"
        />
      </div>
      <div
        class="role__is-admin"
        :class="{ admin: role.isAdmin }"
      >
        {{
          role.isAdmin ? "Есть права администратора" : "Нет прав администратора"
        }}
      </div>
    </div>
    <ButtonAddNew
      v-if="isRolesLoaded"
      class="roles__add-new"
      @click="startNewRoleCreating"
    />
  </div>
</template>

<style scoped lang="scss">
  .roles {
    position: relative;
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    gap: 16px;
    min-height: calc(
      100vh - var(--footer-height) - var(--admin-page-padding) * 2
    );
    font-size: 18px;
    line-height: 18px;
    color: rgb(209, 190, 190);
    font-family: monospace;

    &__add-new {
      flex-shrink: 0;
      min-width: 300px;
      min-height: 60px;
      font: unset;
      color: unset;
    }

    &__spinner {
      inset: -8px;
      border-radius: 16px;
    }
  }

  .role {
    position: relative;
    flex-shrink: 0;
    background-color: #1e1d24;
    padding: 8px 16px;
    border-radius: 12px;

    &.secured {
      outline: 2px solid silver;
    }

    &__del {
      position: absolute;
      top: 8px;
      right: 12px;
    }

    &__is-admin {
      margin-top: 4px;
      font-size: 16px;
      line-height: 16px;

      &.admin {
        color: rgb(255, 50, 50);
      }

      &:not(.admin) {
        color: gray;
      }
    }

    &__icon {
      width: 24px;
      height: 24px;

      &-wrapper {
        margin-right: 8px;
      }
    }

    &__name {
      vertical-align: middle;
    }
  }

  .new-role-form {
    font-size: 18px;
    line-height: 18px;
    font-family: monospace;
    color: rgb(209, 190, 190);

    input {
      color: snow;
    }

    &__item {
      position: relative;
      margin-top: 32px;
    }

    &__is-admin {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 16px;

      > div {
        display: flex;
        align-items: center;
        gap: 8px;

        > input {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: #242936;
        }
      }
    }

    &__submit {
      width: 100%;
      margin-top: 40px;
    }
  }
</style>
