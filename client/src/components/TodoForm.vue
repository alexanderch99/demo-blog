<script setup>
  import { ref } from "vue";

  import InputMain from "@/components/UI/InputMain.vue";
  import TextareaMain from "@/components/UI/TextareaMain.vue";
  import ButtonMain from "@/components/UI/ButtonMain.vue";

  const emit = defineEmits(["emitCreateNewTodo"]);

  const isTitleEmpty = ref(false);
  const isBodyEmpty = ref(false);

  const newTodo = ref({
    title: "",
    body: "",
  });

  function createNewTodo() {
    if (
      newTodo.value.title &&
      newTodo.value.body &&
      newTodo.value.title != " " &&
      newTodo.value.body != " "
    ) {
      emit("emitCreateNewTodo", newTodo.value);
      isTitleEmpty.value = false;
      isBodyEmpty.value = false;
      newTodo.value.title = "";
      newTodo.value.body = "";
      return;
    } else {
      if (!newTodo.value.title || newTodo.value.title == " ") {
        isTitleEmpty.value = true;
      }
      if (!newTodo.value.body || newTodo.value.body == " ") {
        isBodyEmpty.value = true;
      }
    }
  }
</script>

<template>
  <form
    action="#"
    class="todo-form"
    @submit.prevent
  >
    <div class="todo-form__inputs">
      <InputMain
        class="todo-form__input todo-form__item"
        placeholder="Заголовок"
        v-model="newTodo.title"
      />
      <p
        class="todo-form__empty todo-form__empty-title"
        v-if="isTitleEmpty"
      >
        Обязательно
      </p>
      <TextareaMain
        class="todo-form__textarea todo-form__item"
        placeholder="Описание"
        v-model="newTodo.body"
      />
      <p
        class="todo-form__empty todo-form__empty-body"
        v-if="isBodyEmpty"
      >
        Обязательно
      </p>
      <ButtonMain
        class="todo-form__submit todo-form__item"
        @click="createNewTodo"
        >Создать</ButtonMain
      >
    </div>
  </form>
</template>

<style scoped lang="scss">
  .todo-form {
    margin-top: 40px;
    padding: 20px 40px;
    background: linear-gradient(90deg, #5b6c97, #2d53b1);
    border-radius: 15px;

    @media (max-width: 599.98px) {
      padding: 5px 10px;
    }

    &__item {
      background-color: #2b2a33;
    }

    &__inputs {
      display: flex;
      flex-direction: column;
    }

    &__input {
      margin-top: 40px;
    }

    &__textarea {
      margin-top: 20px;
    }

    &__submit {
      margin: 20px 0px 0px auto;
    }

    &__empty {
      color: rgb(133, 53, 53);
      margin-left: 20px;
    }
  }
</style>
