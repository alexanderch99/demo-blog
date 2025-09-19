<script setup>
  const model = defineModel();
</script>

<template>
  <input
    type="text"
    class="input-main"
    v-model="model"
  />
</template>

<style scoped lang="scss">
  .input-main {
    width: 100%;
    padding: 10px 20px;
    border-radius: 15px;
    font: inherit;
    color: inherit;
    background-color: #56555e;

    @media (max-width: 999.98px) {
      padding: 6px 12px;
      font-size: 0.8em;
    }

    @media (max-width: 499.98px) {
      padding: 6px 12px;
      font-size: 0.7em;
    }
  }
</style>
