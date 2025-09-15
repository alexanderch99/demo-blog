<script setup>
  import PencilMain from "../svg/PencilMain.vue";
  import ButtonMain from "./ButtonMain.vue";
</script>

<template>
  <ButtonMain class="button-edit"
    ><PencilMain class="button-edit__icon"
  /></ButtonMain>
</template>

<style scoped lang="scss">
  .button-edit {
    width: 40px;
    height: 40px;

    &__icon {
      position: relative;
      top: -2px;
      width: 20px;
      height: 20px;
    }
  }
</style>
