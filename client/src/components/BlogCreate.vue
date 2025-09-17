<script setup>
  import { ref, watch } from "vue";
  import ButtonMain from "./UI/ButtonMain.vue";
  import InputMain from "./UI/InputMain.vue";

  const emit = defineEmits(["createBlog", "cancelBlogCreate"]);

  const blogTitle = ref("");
  const isSubmitDisabled = ref(false);

  function createBlogHC() {
    isSubmitDisabled.value = true;
    emit("createBlog", blogTitle.value);
  }

  function cancelBlogCreateHc() {
    isSubmitDisabled.value = false;
    emit("cancelBlogCreate");
  }

  watch(
    () => blogTitle.value,
    () => {
      isSubmitDisabled.value = false;
    },
  );
</script>

<template>
  <form
    action="#"
    class="blog-create"
    @submit.prevent
  >
    <InputMain
      class="blog-create__input"
      placeholder="Название блога (от 1 до 50 символов)"
      v-model="blogTitle"
    />
    <div class="blog-create__submit">
      <ButtonMain
        class="blog-create__submit-button"
        @click="createBlogHC"
        :disabled="isSubmitDisabled"
        >Создать</ButtonMain
      >
      <ButtonMain
        class="blog-create__submit-button"
        @click="cancelBlogCreateHc"
        >Отмена</ButtonMain
      >
    </div>
  </form>
</template>

<style scoped lang="scss">
  .blog-create {
    position: relative;
    z-index: 99999;
    display: flex;
    flex-direction: column;
    width: calc(50% - 8px);
    height: 320px;
    padding: 20px 20px 8px 20px;
    background-color: transparent;
    flex-grow: 0;
    flex-shrink: 0;
    border-radius: 16px;
    border: 3px solid #1e1d24;

    &__input {
      font-size: 18px;
      line-height: 18px;
    }

    &__submit {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: auto;
      font-size: 18px;
      line-height: 18px;
    }
  }
</style>
