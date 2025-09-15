<script setup></script>

<template>
  <button class="navigation-button">
    <slot />
  </button>
</template>

<style lang="scss">
  .navigation-button {
    & span {
      vertical-align: text-bottom;
    }

    & a {
      display: inline-block;
      background-color: #0c0c0e;
      padding: 8px 16px 8px 8px;
      border-radius: 10px;
      font-size: 18px;
      line-height: 18px;
    }
  }
</style>
