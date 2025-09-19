<script setup></script>

<template>
  <button class="button-main">
    <slot />
  </button>
</template>

<style scoped lang="scss">
  .button-main {
    display: block;
    padding: 10px 0px;
    width: 350px;
    background-color: #1c1b22;
    text-align: center;
    margin: 0 auto;
    border: 1px solid #56555e;
    border-radius: 15px;
    word-break: break-all;

    @media (max-width: 599.98px) {
      width: 100%;
      padding: 6px 8px;
      font-size: 0.9em;
    }
  }
</style>
