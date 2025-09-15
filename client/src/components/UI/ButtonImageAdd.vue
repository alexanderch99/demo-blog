<script setup>
  import ImageAdd from "../svg/ImageAdd.vue";
  import ButtonMain from "./ButtonMain.vue";
</script>

<template>
  <ButtonMain class="button-image-add"
    ><ImageAdd class="button-image-add__icon"
  /></ButtonMain>
</template>

<style scoped lang="scss">
  .button-image-add {
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
