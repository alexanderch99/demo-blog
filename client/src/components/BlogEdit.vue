<script setup>
  import { ref } from "vue";
  import InputMain from "./UI/InputMain.vue";
  import ButtonMain from "./UI/ButtonMain.vue";

  const { blog } = defineProps(["blog"]);
  const emit = defineEmits(["closeModal", "updateBlogTitle"]);

  const blogNewTitle = ref(blog.title);

  function closeModalHC() {
    emit("closeModal");
  }

  function updateBlogTitleHC() {
    emit("updateBlogTitle", blog.id, blogNewTitle.value);
  }
</script>

<template>
  <form
    action="#"
    class="blog-edit"
    @submit.prevent
  >
    <div class="blog-edit__item">
      <label
        for="blog-title"
        class="blog-edit__label"
        >Новый заголовок блога</label
      >
      <InputMain
        class="blog-edit__input"
        v-model="blogNewTitle"
        name="blog-title"
      />
      <div class="form-count">{{ blogNewTitle?.length }} / 50</div>
    </div>
    <div class="blog-edit__submit">
      <ButtonMain
        class="blog-edit__submit-button"
        @click="updateBlogTitleHC"
        >Сохранить и закрыть</ButtonMain
      >
      <ButtonMain
        class="blog-edit__submit-button"
        @click="closeModalHC"
        >Отмена</ButtonMain
      >
    </div>
  </form>
</template>

<style scoped lang="scss">
  .blog-edit {
    &__item {
      position: relative;
    }

    &__label {
      margin-left: 4px;

      @media (max-width: 999.98px) {
        font-size: 0.9em;
      }
    }

    &__input {
      margin-top: 8px;
    }

    &__submit {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 50px;
      gap: 20px;

      @media (max-width: 499.98px) {
        flex-direction: column;
        gap: 8px;
      }

      &-button {
        margin: 0;

        @media (max-width: 999.98px) {
          grid-template: auto / 50px 1fr;
          font-size: 0.8em;
        }
      }
    }
  }
</style>
