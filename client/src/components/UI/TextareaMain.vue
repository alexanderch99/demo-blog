<script setup>
  const model = defineModel();
</script>

<template>
  <textarea
    class="textarea-main"
    v-model="model"
  />
</template>

<style scoped lang="scss">
  .textarea-main {
    min-width: 100%;
    max-width: 100%;
    min-height: 200px;
    max-height: 400px;
    padding: 10px 20px;
    border-radius: 15px;
    font: inherit;
    color: inherit;
    background-color: #56555e;

    @media (max-height: 999.98px) {
      font-size: 0.8em;
      padding: 8px 12px;
    }
  }
</style>
