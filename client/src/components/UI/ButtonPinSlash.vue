<script setup>
  import ThumbtackSlash from "../svg/ThumbtackSlash.vue";
  import ButtonMain from "./ButtonMain.vue";
</script>

<template>
  <ButtonMain class="button-pin-slash"
    ><ThumbtackSlash class="button-pin-slash__icon"
  /></ButtonMain>
</template>

<style scoped lang="scss">
  .button-pin-slash {
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
