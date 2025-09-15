<script setup>
  import { ref } from "vue";
  import InputMain from "./UI/InputMain.vue";
  import TextareaMain from "./UI/TextareaMain.vue";
  import ProfileLink from "./ProfileLink.vue";
  import ProfileInterest from "./ProfileInterest.vue";
  import ButtonAddNew from "./UI/ButtonAddNew.vue";
  import ButtonMini from "./UI/ButtonMini.vue";
  import CheckMain from "./svg/CheckMain.vue";
  import XmarkMain from "./svg/XmarkMain.vue";
  import ButtonMain from "./UI/ButtonMain.vue";
  import delNoneValues from "@/utils/del-none-values";

  const { userPublicInfo } = defineProps(["userPublicInfo"]);

  const newUserInfo = ref(JSON.parse(JSON.stringify(userPublicInfo)));

  const newLink = ref({
    name: "",
    link: "",
  });
  const newInterest = ref("");

  const isLinkAdding = ref(false);
  const isInterestAdding = ref(false);

  function startLinkAdding() {
    isLinkAdding.value = true;
  }

  function startInterestAdding() {
    isInterestAdding.value = true;
  }

  function cancelLinkAdding() {
    isLinkAdding.value = false;
    newLink.value = {
      name: "",
      link: "",
    };
  }

  function cancelInterestAdding() {
    isInterestAdding.value = false;
    newInterest.value = "";
  }

  function addNewLink() {
    if (
      !newLink.value.link.startsWith("http://") &&
      !newLink.value.link.startsWith("https://")
    ) {
      newLink.value.link = `https://${newLink.value.link}`;
    }
    newUserInfo.value.links.push(newLink.value);
    cancelLinkAdding();
  }

  function addNewInterest() {
    newUserInfo.value.interests.push(newInterest.value);
    cancelInterestAdding();
  }

  function delProfileLink(link) {
    newUserInfo.value.links.splice(
      newUserInfo.value.links.findIndex(el => el.name == link.name),
      1,
    );
  }

  function delProfileInterest(interest) {
    newUserInfo.value.interests.splice(
      newUserInfo.value.interests.findIndex(el => el == interest),
      1,
    );
  }

  const emit = defineEmits(["closeModal", "updateUserPublicInfo"]);

  function closeModalHC() {
    emit("closeModal");
  }

  function updateUserPublicInfoHC() {
    emit("updateUserPublicInfo", newUserInfo.value);
  }

  delNoneValues(newUserInfo.value);
</script>

<template>
  <div class="profile-edit">
    <form
      action="#"
      class="form"
      @submit.prevent
    >
      <div class="form__item form__nickname">
        <label
          for="nickname"
          class="form__subheading"
          >Никнейм</label
        >
        <InputMain
          class="form__input form__nickname-input"
          name="nickname"
          id="nickname"
          v-model="newUserInfo.nickname"
        />
        <p class="form-count form__nickname-count">
          2 / {{ newUserInfo.nickname.length }} / 32
        </p>
      </div>
      <!-- next item -->
      <div class="form__item form__bio">
        <label
          for="bio"
          class="form__subheading"
          >Краткое описание</label
        >
        <TextareaMain
          class="form__textarea form__bio-textarea"
          name="bio"
          id="bio"
          v-model="newUserInfo.bio"
        />
        <p class="form-count form__bio-count">
          {{ newUserInfo.bio.length }} / 400
        </p>
      </div>
      <!-- next item -->
      <div class="form__item form__location">
        <label
          for="location"
          class="form__subheading"
          >Место жительства</label
        >
        <InputMain
          class="form__input form__location-input"
          name="location"
          id="location"
          v-model="newUserInfo.location"
        />
        <p class="form-count form__location-count">
          {{ newUserInfo.location.length }} / 99
        </p>
      </div>
      <!-- next item -->
      <div class="form__item form__links">
        <p class="form__subheading">Контакты, ссылки</p>
        <div class="form__profile-links">
          <div
            class="form__link-wrapper"
            v-for="link in newUserInfo.links"
            :key="link.link"
          >
            <ProfileLink
              class="form__profile-link"
              :link="link"
            />
            <ButtonMini
              class="notab form__del-profile-link"
              @click="delProfileLink(link)"
            >
              <XmarkMain class="form__icon" />
            </ButtonMini>
          </div>
          <ButtonAddNew
            v-if="!isLinkAdding"
            class="notab form__add-new"
            @click="startLinkAdding"
          />
        </div>
        <div class="form-add-link-wrapper">
          <form
            v-if="isLinkAdding"
            action="#"
            class="form-add-link"
            @submit.prevent
          >
            <div class="form-add-link__inputs">
              <InputMain
                class="form-add-link__input"
                v-model="newLink.name"
                placeholder="Название (от 1 до 32 символов)"
              />
              <InputMain
                class="form-add-link__input"
                v-model="newLink.link"
                placeholder="Ссылка (от 1 до 199 символов)"
              />
            </div>
            <div class="form-add-link__buttons">
              <ButtonMini
                class="form-add-link__button form-add-link__button-check"
                @click="addNewLink"
              >
                <CheckMain class="form__icon" />
              </ButtonMini>
              <ButtonMini
                class="form-add-link__button form-add-link__button-xmark"
                @click="cancelLinkAdding"
              >
                <XmarkMain class="form__icon" />
              </ButtonMini>
            </div>
          </form>
        </div>
        <p class="form-count form__links-count">
          {{ newUserInfo.links.length }} / 10
        </p>
      </div>
      <!-- next item -->
      <div class="form__item form__interests">
        <p class="form__subheading">Интересы</p>
        <div class="form__profile-interests">
          <div
            class="form__interest-wrapper"
            v-for="interest in newUserInfo.interests"
            :key="interest"
          >
            <ProfileInterest
              class="form__profile-interest"
              :interest="interest"
            />
            <ButtonMini
              class="notab form__del-profile-link"
              @click="delProfileInterest(interest)"
            >
              <XmarkMain class="form__icon" />
            </ButtonMini>
          </div>
          <ButtonAddNew
            class="notab form__add-new"
            v-if="!isInterestAdding"
            @click="startInterestAdding"
          />
        </div>
        <div class="form-add-interest-wrapper">
          <form
            v-if="isInterestAdding"
            action="#"
            class="form-add-interest"
            @submit.prevent
          >
            <div class="form-add-interest__inputs">
              <InputMain
                class="form-add-interest__input"
                v-model="newInterest"
                placeholder="Название (от 1 до 32 символов)"
              />
            </div>
            <div class="form-add-interest__buttons">
              <ButtonMini
                class="form-add-interest__button form-add-interest__button-check"
                @click="addNewInterest"
              >
                <CheckMain class="form__icon" />
              </ButtonMini>
              <ButtonMini
                class="form-add-interest__button form-add-interest__button-xmark"
                @click="cancelInterestAdding"
              >
                <XmarkMain class="form__icon" />
              </ButtonMini>
            </div>
          </form>
        </div>
        <p class="form-count form__interests-count">
          {{ newUserInfo.interests.length }} / 10
        </p>
      </div>
      <!-- /items -->
      <div class="form__submit">
        <ButtonMain
          class="form__submit-button"
          @click="updateUserPublicInfoHC"
          >Сохранить и закрыть</ButtonMain
        >
        <ButtonMain
          class="form__submit-button"
          @click="closeModalHC"
          >Отмена</ButtonMain
        >
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
  .form-add-link,
  .form-add-interest {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;

    &__button-check {
      &:hover {
        background-color: green;
      }
    }

    &__button-xmark {
      &:hover {
        background-color: red;
      }
    }

    &__inputs,
    &__buttons {
      flex-grow: 0;
      flex-shrink: 0;
    }

    &__inputs {
      width: calc(100% - 80px);
      display: flex;
      justify-content: space-between;
    }

    &__buttons {
      display: flex;
      justify-content: space-between;
      width: 68px;
    }

    &__input {
      width: 49%;
      font-size: 16px;
      line-height: 16px;
    }
  }

  .form-add-interest {
    &__input {
      width: 100%;
    }
  }

  .form {
    &__submit {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 50px;

      &-button {
        margin: 0;
      }
    }

    &__del-profile-link {
      position: absolute;
      top: 50%;
      right: 8px;
      transform: translateY(-50%);
      cursor: pointer;
      background-color: transparent;
    }

    &__profile-link,
    &__profile-interest {
      position: relative;
      padding-right: 50px;
    }

    &__icon {
      width: 20px;
      height: 20px;
    }

    &__subheading {
      display: block;
      margin-bottom: 8px;
      margin-left: 4px;
    }

    &__link-wrapper,
    &__interest-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    &__profile-links,
    &__profile-interests {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 8px;
    }

    &__bio {
      &-textarea {
        min-height: 150px;
        max-height: 400px;
      }
    }

    &__item {
      position: relative;

      &:not(:first-child) {
        margin-top: 30px;
      }
    }
  }
</style>
