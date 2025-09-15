<script setup>
  const { size, fake } = defineProps(["size", "fake"]);
</script>

<template>
  <div class="spinner-loading">
    <div
      class="spinner-wrapper"
      :style="{ width: size || '40px', height: size || '40px' }"
    >
      <div class="spinner"></div>
    </div>
    <p
      v-if="fake"
      class="fake"
    >
      Искусственная задержка
    </p>
  </div>
</template>

<style scoped>
  .spinner-loading {
    position: absolute;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1e1d24;
    border-radius: inherit;
    top: -1px;
    right: -1px;
    bottom: -1px;
    left: -1px;
  }

  .spinner {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 6px solid rgba(0, 0, 0, 0.5);
    border-top-color: #4f46e5;
    animation: spin 0.8s linear infinite;
  }

  .fake {
    margin-top: 8px;
    font-size: 16px;
    line-height: 16px;
    font-family: monospace;
    color: gray;
    position: absolute;
    margin-top: 80px;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation-duration: 1.6s;
    }
  }
</style>
