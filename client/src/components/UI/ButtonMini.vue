<script setup></script>

<template>
  <button class="button-mini"><slot /></button>
</template>

<style scoped lang="scss">
  .button-mini {
    width: 30px;
    height: 30px;
    background-color: #56555e;
    border-radius: 8px;

    @media (max-height: 999.98px) {
      width: 24px;
      height: 24px;
    }
  }
</style>
