<script setup>
  import LinkMain from "./svg/LinkMain.vue";

  const { link } = defineProps(["link"]);
</script>

<template>
  <a
    :href="link.link"
    target="_blank"
    rel="noopener noreferrer nofollow"
    class="profile-link"
  >
    <p class="profile-link__name">{{ link.name }}</p>
    <p class="profile-link__link">
      <span> <LinkMain class="profile-link__icon" /> </span>
      <span>{{ link.link }}</span>
    </p>
  </a>
</template>

<style scoped lang="scss">
  .profile-link {
    background-color: #56555e;
    padding: 6px 12px;
    border-radius: 16px;
    cursor: pointer;
    min-width: 100px;
    min-height: 46px;

    &__name {
      font-size: 16px;
      line-height: 16px;
      margin-top: 2px;
      word-break: break-all;
    }

    &__link {
      margin-top: 4px;
      font-size: 12px;
      line-height: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
      word-break: break-all;
    }

    &__icon {
      width: 16px;
      height: 16px;
    }
  }
</style>
