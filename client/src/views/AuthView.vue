<script setup>
  import { ref, computed } from "vue";

  import InputMain from "@/components/UI/InputMain.vue";
  import ButtonText from "@/components/UI/ButtonText.vue";
  import ButtonMain from "@/components/UI/ButtonMain.vue";
  import HrMain from "@/components/UI/HrMain.vue";
  import EyeMain from "@/components/svg/EyeMain.vue";
  import EyeSlash from "@/components/svg/EyeSlash.vue";
  import authService from "@/services/auth-service";
  import handleAxiosError from "@/utils/handle-axios-error";

  import { useRouter } from "vue-router";
  const router = useRouter();

  import { useAuthStore } from "@/stores/auth-store";
  const authStore = useAuthStore();

  const user = ref({
    username: "",
    password: "",
  });

  const passwordType = ref(true);

  const isPasswordRulesVisible = ref(false);

  const authType = ref("auth");

  const computedPasswordType = computed(() => {
    return passwordType.value ? "password" : "text";
  });

  const formSubmitTextContent = computed(() => {
    return authType.value == "auth" ? "Войти" : "Зарегистрироваться";
  });

  const togglePasswordType = () => {
    passwordType.value = !passwordType.value;
  };

  function showPasswordRules() {
    if (authType.value != "auth") {
      isPasswordRulesVisible.value = true;
    }
  }
  function hidePasswordRules() {
    isPasswordRulesVisible.value = false;
  }

  function changeAuthType(event) {
    if (event.target.tagName == "BUTTON") {
      authType.value = event.target.dataset.authType;
    }
  }

  async function formSubmit() {
    if (authType.value == "auth") {
      try {
        const response = await authService.login(
          user.value.username,
          user.value.password,
        );
        const payload = response.data;

        authStore.logIn(payload);
        router.push("/");
        return;
      } catch (error) {
        handleAxiosError(error);
      }
    } else if (authType.value == "reg") {
      try {
        const response = await authService.registration(
          user.value.username,
          user.value.password,
        );
        const payload = response.data;

        authStore.logIn(payload);
        router.push("/");
        return;
      } catch (error) {
        handleAxiosError(error);
      }
    } else {
      return false;
    }
  }
</script>

<template>
  <div class="container">
    <div class="auth">
      <form
        action="#"
        class="auth-form"
        @submit.prevent
      >
        <div
          class="auth-form__buttons"
          @click="changeAuthType"
        >
          <ButtonText
            class="auth-form__button notab"
            data-auth-type="auth"
            :class="{ active: authType == 'auth' }"
            >Вход</ButtonText
          >
          <ButtonText
            class="auth-form__button notab"
            data-auth-type="reg"
            :class="{ active: authType == 'reg' }"
            >Регистрация</ButtonText
          >
        </div>
        <div class="auth-form__inputs">
          <div class="auth-form__input-wrapper auth-form__username">
            <InputMain
              type="text"
              name="username"
              id="username"
              class="auth-form__input auth-form__input-username"
              v-model="user.username"
            />
            <label for="username">Логин</label>
          </div>
          <div class="auth-form__input-wrapper auth-form__password">
            <InputMain
              :type="computedPasswordType"
              name="password"
              id="password"
              class="auth-form__input auth-form__input-password"
              v-model="user.password"
              @focus="showPasswordRules"
              @blur="hidePasswordRules"
            />
            <label for="password">Пароль</label>
            <EyeMain
              v-if="passwordType"
              class="auth-form__password-eye-main auth-form__password-eye"
              @click="togglePasswordType"
            />
            <EyeSlash
              v-else
              class="auth-form__password-eye-slash auth-form__password-eye"
              @click="togglePasswordType"
            />
          </div>
        </div>
        <ButtonMain
          class="auth-form__submit"
          @click="formSubmit"
          >{{ formSubmitTextContent }}</ButtonMain
        >
        <div
          class="auth-form__password-rules"
          v-if="isPasswordRulesVisible"
        >
          <p class="auth-form__password-rule">
            Только латиница, арабские цифры и специальные символы
          </p>
          <p class="auth-form__password-rule">
            Как минимум 1 строчная буква, 1 прописная буква, 1 цифра и 1
            специальный символ
          </p>
          <p class="auth-form__password-rule">От 12 до 32 символов</p>
        </div>
        <HrMain />
        <div class="auth-form__forgot-password">
          Этот демонстрационный сайт не производит никаких действий с
          персональными данными. Регистрация недоступна. Для демонстрации всего
          функционала посетителям доступны 4 обезличенных якобы учетных записи.
          Используются только технические файлы cookie только в целях
          демонстрации функционала сайта. Ознакомиться с исходным кодом сайта
          можно по ссылке:
          <a
            class="auth-form__source-link"
            href="https://github.com/alexanderch99"
            target="_blank"
            >https://github.com/alexanderch99</a
          >
          <div class="auth-form__fake-accounts">
            <div class="fake-account">
              <div class="fake-account__login">
                <p>Логин</p>
                <p>AdminTest</p>
              </div>
              <div class="fake-account__password">
                <p>Пароль</p>
                <p>TestAuthTestAuth11%%</p>
              </div>
            </div>
            <!-- next fake account -->
            <div class="fake-account">
              <div class="fake-account__login">
                <p>Логин</p>
                <p>UserTest1</p>
              </div>
              <div class="fake-account__password">
                <p>Пароль</p>
                <p>TestAuthTestAuth22%%</p>
              </div>
            </div>
            <!-- next fake account -->
            <div class="fake-account">
              <div class="fake-account__login">
                <p>Логин</p>
                <p>UserTest2</p>
              </div>
              <div class="fake-account__password">
                <p>Пароль</p>
                <p>TestAuthTestAuth33%%</p>
              </div>
            </div>
            <!-- next fake account -->
            <div class="fake-account">
              <div class="fake-account__login">
                <p>Логин</p>
                <p>UserTest3</p>
              </div>
              <div class="fake-account__password">
                <p>Пароль</p>
                <p>TestAuthTestAuth44%%</p>
              </div>
            </div>
            <!-- next fake account -->
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .auth {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 80px;
  }

  .auth-form {
    position: relative;
    width: 800px;
    padding: 40px 60px;
    background-color: #1f2430;
    border-radius: 10px;

    &__source-link {
      color: snow;
      text-decoration: underline snow !important;
    }

    &__password-rules {
      position: absolute;
      top: 110px;
      right: 0px;
      width: 400px;
      font-size: 14px;
      padding: 20px;
      background-color: #1f2430;
      border-radius: 10px;
    }

    &__password-rule {
      line-height: 20px;
    }

    &__buttons {
      margin: 20px 0px;
      display: flex;
      align-items: center;
      gap: 40px;
      color: gray;
    }

    &__button.active {
      color: snow;
      border-bottom: 2px solid orange;
      padding-bottom: 4px;
    }

    &__input {
      margin-top: 50px;

      &-wrapper {
        position: relative;
      }

      & + label {
        position: absolute;
        top: 25px;
        left: 15px;
      }

      &-password {
        padding-right: 64px;
      }
    }

    &__password {
      position: relative;

      &-eye {
        position: absolute;
        top: 54px;
        right: 10px;
        cursor: pointer;
        width: 36px;
        height: 36px;
      }
    }

    &__submit {
      margin-top: 40px;
    }

    &__forgot-password {
      display: block;
      margin: 0 auto;
      font-size: 16px;
      line-height: 16px;
      font-family: monospace;
      color: gray;
    }

    &__fake-accounts {
      display: flex;
      flex-wrap: wrap;
      margin-top: 20px;
      gap: 16px;
      text-align-last: left;
      cursor: default;

      > div p:last-child {
        color: snow;
        margin-left: -8px;
      }

      > div p:first-child {
        margin-top: 4px;
      }
    }
  }

  .user {
    background-color: #1f2430;
    padding: 20px;
    margin: 10px;
  }

  .fake-account {
    width: calc(50% - 16px);
  }
</style>
