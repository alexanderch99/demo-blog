<script setup>
  import PlusMain from "@/components/svg/PlusMain.vue";
</script>

<template>
  <button class="button-add-new">
    <PlusMain class="icon icon-plus button-add-new__icon" />
    <span class="button-add-new__text"><slot>Добавить</slot></span>
  </button>
</template>

<style scoped lang="scss">
  .button-add-new {
    position: relative;
    z-index: 999;
    padding: 4px 12px 4px 8px;
    font-size: 14px;
    line-height: 14px;
    cursor: pointer;
    border-radius: 16px;
    border: 1px dashed gray;
    color: gray;
    flex-grow: 0;
    flex-shrink: 0;
    transition: border 0.1s ease, color 0.1s ease;

    &:hover {
      border: 1px dashed rgb(162, 104, 215);
      color: snow;
    }

    &__text {
      position: relative;
      top: 1px;
      margin-left: 8px;
    }

    &__icon {
      width: 20px;
      height: 20px;
    }
  }
</style>
