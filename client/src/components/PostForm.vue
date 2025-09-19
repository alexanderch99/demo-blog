<script setup>
  import { onMounted, ref, watch } from "vue";
  import ButtonMain from "./UI/ButtonMain.vue";
  import InputMain from "./UI/InputMain.vue";
  import TextareaMain from "./UI/TextareaMain.vue";
  import ButtonMini from "./UI/ButtonMini.vue";
  import CheckMain from "./svg/CheckMain.vue";
  import XmarkMain from "./svg/XmarkMain.vue";
  import ButtonAddNew from "./UI/ButtonAddNew.vue";
  import PostTag from "./PostTag.vue";

  const { postDataForEdit } = defineProps(["postDataForEdit"]);
  const emit = defineEmits(["submitForm", "cancelForm"]);

  const isTagsAdding = ref(false);
  const isSubmitDisabled = ref(false);

  const post = ref({
    title: "",
    body: "",
    tags: [],
  });

  const postCopy = ref("");

  const newTag = ref("");

  function startTagsAdding() {
    isTagsAdding.value = true;
  }

  function cancelTagsAdding() {
    isTagsAdding.value = false;
  }

  function addNewTag() {
    postCopy.value.tags.push(newTag.value);
    newTag.value = "";
  }

  function delTag(tag) {
    postCopy.value.tags.splice(
      postCopy.value.tags.findIndex(el => el == tag),
      1,
    );
  }

  function submitFormHC() {
    emit("submitForm", postCopy.value);
    isSubmitDisabled.value = true;
  }

  function cancelFormHC() {
    emit("cancelForm");
    isSubmitDisabled.value = false;
  }

  onMounted(() => {
    if (postDataForEdit) {
      post.value = postDataForEdit;
    }

    postCopy.value = JSON.parse(JSON.stringify(post.value));
  });

  watch(
    postCopy,
    () => {
      isSubmitDisabled.value = false;
    },
    {
      deep: true,
    },
  );
</script>

<template>
  <form
    action="#"
    class="post-form"
    @submit.prevent
  >
    <div class="post-form__item">
      <label
        for="post-title"
        class="post-form__label"
        >Заголовок</label
      >
      <InputMain
        name="post-title"
        class="post-form__input"
        v-model="postCopy.title"
      />
      <div class="form-count">{{ postCopy.title?.length }} / 50</div>
    </div>
    <div class="post-form__item">
      <label
        for="post-body"
        class="post-form__label"
        >Содержание</label
      >
      <TextareaMain
        name="post-body"
        class="post-form__textarea"
        v-model="postCopy.body"
      />
      <div class="form-count">{{ postCopy.body?.length }} / 9999</div>
    </div>
    <div class="post-form__item">
      <p class="post-form__label">Теги</p>
      <div class="post-form__tags">
        <PostTag
          class="post-form__tag"
          v-for="tag in postCopy.tags"
          :key="tag"
          ><span>{{ tag }}</span>
          <div
            class="post-form__del-tag"
            @click="delTag(tag)"
          >
            &times;
          </div>
        </PostTag>
        <ButtonAddNew
          v-if="!isTagsAdding"
          class="post-form__button post-form__button--add-new"
          @click="startTagsAdding"
        />
        <div class="form-count">{{ postCopy.tags?.length }} / 5</div>
      </div>
      <div
        v-if="isTagsAdding"
        class="post-form__add-tag"
      >
        <InputMain
          name="post-tag"
          class="post-form__input post-form__input--add-tag"
          v-model="newTag"
          placeholder="От 1 до 32 символов"
        />
        <div class="post-form__add-tag-buttons">
          <ButtonMini
            class="post-form__button post-form__button--add-tag"
            @click="addNewTag"
            ><CheckMain class="post-form__icon"
          /></ButtonMini>
          <ButtonMini
            class="post-form__button post-form__button--cancel-tag"
            @click="cancelTagsAdding"
            ><XmarkMain class="post-form__icon"
          /></ButtonMini>
        </div>
      </div>
    </div>
    <div class="post-form__submit">
      <ButtonMain
        class="post-form__button post-form__button--submit"
        @click="submitFormHC"
        :disabled="isSubmitDisabled"
        ><slot
      /></ButtonMain>
      <ButtonMain
        class="post-form__button post-form__button--cancel"
        @click="cancelFormHC"
        >Отменить</ButtonMain
      >
    </div>
  </form>
</template>

<style scoped lang="scss">
  .post-form {
    &__textarea {
      max-height: 2000px;
    }

    &__item {
      position: relative;
    }

    &__item:not(:first-child) {
      margin-top: 30px;
    }

    &__label {
      display: block;
      margin-left: 4px;
      margin-bottom: 8px;

      @media (max-height: 999.98px) {
        font-size: 0.8em;
      }
    }

    &__add-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;

      &-buttons {
        display: flex;
        gap: 8px;
      }
    }

    &__button {
      box-sizing: content-box;
      padding: 2px;

      &--add-new {
        padding: 4px 8px;
      }
    }

    &__tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 8px;

      @media (max-height: 999.98px) {
        font-size: 0.9em;
        gap: 4px;
      }
    }

    &__tag {
      position: relative;
      flex-grow: 0;
      flex-shrink: 0;
      padding-right: 32px;
      cursor: default;

      > span {
        vertical-align: text-bottom;
      }
    }

    &__del-tag {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      font-size: 24px;
      cursor: pointer;
    }

    &__submit {
      display: flex;
      justify-content: center;
      gap: 20px;
      margin-top: 50px;

      @media (max-height: 999.98px) {
        flex-direction: column;
        gap: 8px;
        font-size: 0.8em;
      }

      & > button {
        margin: 0;
        padding: 8px 0px;
      }
    }
  }
</style>
