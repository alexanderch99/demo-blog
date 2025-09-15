<script setup>
  const { interest } = defineProps(["interest"]);
</script>

<template>
  <div class="profile-interest">
    <p class="profile-interest__interest">{{ interest }}</p>
  </div>
</template>

<style scoped lang="scss">
  .profile-interest {
    background-color: #56555e;
    padding: 6px 12px;
    border-radius: 12px;
    cursor: default;
    min-width: 100px;
    min-height: 18px;

    &__interest {
      margin-top: 2px;
      font-size: 16px;
      line-height: 16px;
    }
  }
</style>
