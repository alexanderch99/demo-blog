<script setup></script>

<template>
  <div class="post-tag">
    <slot />
  </div>
</template>

<style scoped>
  .post-tag {
    padding: 6px 12px;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 10px;
    cursor: pointer;
    color: rgb(170, 150, 150);
    font-size: 16px;
    line-height: 16px;
  }
</style>
