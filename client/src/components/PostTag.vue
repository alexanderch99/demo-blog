<script setup></script>

<template>
  <div class="post-tag">
    <slot />
  </div>
</template>

<style scoped lang="scss">
  .post-tag {
    padding: 6px 12px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    cursor: pointer;
    color: rgb(170, 150, 150);
    font-size: 16px;
    line-height: 16px;

    @media (max-width: 999.98px) {
      font-size: 0.8em;
      padding: 4px 8px;
    }
  }
</style>
