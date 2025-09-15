<script setup>
  import XmarkMain from "../svg/XmarkMain.vue";
  import ButtonMain from "./ButtonMain.vue";
</script>

<template>
  <ButtonMain class="button-edit"
    ><XmarkMain class="button-edit__icon"
  /></ButtonMain>
</template>

<style scoped lang="scss">
  .button-edit {
    width: 40px;
    height: 40px;

    &__icon {
      position: relative;
      top: -2px;
      width: 24px;
      height: 24px;
    }
  }
</style>
