<script setup>
  import PencilMain from "./svg/PencilMain.vue";

  const props = defineProps(["id", "title", "body"]);
  const emit = defineEmits(["emitDelTodoItem", "emitEditTodoItem"]);

  function delTodoItem(id) {
    emit("emitDelTodoItem", id);
  }

  function editTodoItem(id, title, body) {
    emit("emitEditTodoItem", id, title, body);
  }
</script>

<template>
  <div class="todo-item">
    <div class="todo-item__main">
      <p class="todo-item__title">{{ title }}</p>
      <p class="todo-item__body">{{ body }}</p>
    </div>
    <div class="todo-item__id">id: {{ id }}</div>
    <button
      class="todo-item__del notab"
      @click="delTodoItem(id)"
    >
      &times;
    </button>
    <button
      class="todo-item__edit notab"
      @click="editTodoItem(id, title, body)"
    >
      <PencilMain />
    </button>
  </div>
</template>

<style scoped lang="scss">
  .todo-item {
    position: relative;
    padding: 20px 40px;
    background-color: #1e1d24;
    border-radius: 15px;
    white-space: pre-wrap;

    @media (max-width: 599.98px) {
      padding: 10px 20px;
    }

    &:not(:first-child) {
      margin-top: 20px;
    }

    &__main {
      width: 90%;
    }

    &__title {
      font-size: 30px;
      line-height: 30px;

      @media (max-width: 599.98px) {
        font-size: 20px;
        line-height: 30px;
      }
    }

    &__body {
      margin-top: 8px;
      font-size: 20px;
      color: gray;

      @media (max-width: 599.98px) {
        font-size: 16px;
        line-height: 16px;
      }
    }

    &__id {
      position: absolute;
      bottom: 5px;
      right: 10px;
      font-size: 16px;
      color: rgb(85, 74, 74);

      @media (max-width: 599.98px) {
        font-size: 12px;
        line-height: 12px;
      }
    }

    &__del,
    &__edit {
      position: absolute;
      top: 5px;
      right: 10px;
      font-size: 34px;
      color: snow;
    }

    &__edit {
      width: 16px;
      height: 16px;
      top: 4px;
      right: 50px;
    }
  }
</style>
