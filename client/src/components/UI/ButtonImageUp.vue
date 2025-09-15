<script setup>
  import ImageUp from "../svg/ImageUp.vue";
  import ButtonMain from "./ButtonMain.vue";
</script>

<template>
  <ButtonMain class="button-image-up"
    ><ImageUp class="button-image-up__icon"
  /></ButtonMain>
</template>

<style scoped lang="scss">
  .button-image-up {
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
