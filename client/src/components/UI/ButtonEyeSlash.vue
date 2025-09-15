<script setup>
  import ButtonMain from "./ButtonMain.vue";
  import EyeSlash from "../svg/EyeSlash.vue";
</script>

<template>
  <ButtonMain class="button-eye-slash"
    ><EyeSlash class="button-eye-slash__icon"
  /></ButtonMain>
</template>

<style scoped lang="scss">
  .button-eye-slash {
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
