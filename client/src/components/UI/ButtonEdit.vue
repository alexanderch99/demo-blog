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

    @media (max-width: 999.98px) {
      width: 32px;
      height: 32px;
    }

    @media (max-width: 599.98px) {
      padding: 10px 0px;
    }

    &__icon {
      position: relative;
      top: -2px;
      width: 20px;
      height: 20px;

      @media (max-width: 999.98px) {
        top: -4px;
        width: 16px;
        height: 16px;
      }
    }
  }
</style>
