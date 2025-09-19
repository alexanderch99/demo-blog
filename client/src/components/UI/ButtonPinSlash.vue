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
      width: 24px;
      height: 24px;
    }

    @media (max-width: 999.98px) {
      top: -6px;
      width: 18px;
      height: 18px;
    }
  }
</style>
