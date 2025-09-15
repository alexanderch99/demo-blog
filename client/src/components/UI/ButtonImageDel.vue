<script setup>
  import ImageDel from "../svg/ImageDel.vue";
  import ButtonMain from "./ButtonMain.vue";
</script>

<template>
  <ButtonMain class="button-image-del"
    ><ImageDel class="button-image-del__icon"
  /></ButtonMain>
</template>

<style scoped lang="scss">
  .button-image-del {
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
