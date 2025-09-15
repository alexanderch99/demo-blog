<script setup>
  import ThumbtackMain from "../svg/ThumbtackMain.vue";
  import ButtonMain from "./ButtonMain.vue";
</script>

<template>
  <ButtonMain class="button-pin"
    ><ThumbtackMain class="button-pin__icon"
  /></ButtonMain>
</template>

<style scoped lang="scss">
  .button-pin {
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
