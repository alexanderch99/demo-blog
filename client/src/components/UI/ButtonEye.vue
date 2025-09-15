<script setup>
  import ButtonMain from "./ButtonMain.vue";
  import EyeMain from "../svg/EyeMain.vue";
</script>

<template>
  <ButtonMain class="button-eye"
    ><EyeMain class="button-eye__icon"
  /></ButtonMain>
</template>

<style scoped lang="scss">
  .button-eye {
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
