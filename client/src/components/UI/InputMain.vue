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

<style scoped>
  .input-main {
    width: 100%;
    padding: 10px 20px;
    border-radius: 15px;
    font: inherit;
    color: inherit;
    background-color: #56555e;
  }
</style>
