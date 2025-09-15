<script setup>
  import ButtonMain from "@/components/UI/ButtonMain.vue";
</script>

<template>
  <div class="not-found">
    <h1>Такой страницы не существует</h1>
    <ButtonMain class="not-found__home">
      <router-link to="/">На главную</router-link></ButtonMain
    >
  </div>
</template>

<style scoped lang="scss">
  .not-found {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    background-color: #242936;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    &__home {
      margin-top: 30px !important;
    }
  }
</style>
