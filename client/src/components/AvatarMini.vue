<script setup>
  const { avatarUrl, nicknameFirstLetter } = defineProps([
    "avatarUrl",
    "nicknameFirstLetter",
  ]);
</script>

<template>
  <div class="avatar-mini">
    <img
      v-if="avatarUrl && avatarUrl != 'none'"
      :src="avatarUrl"
      alt="avatar"
      class="avatar-mini-img"
    />
    <div
      v-else
      class="avatar-mini__no-avatar"
    >
      {{ nicknameFirstLetter }}
    </div>
  </div>
</template>

<style scoped lang="scss">
  .avatar-mini {
    width: 48px;
    height: 48px;
    background-color: transparent;
    margin-right: 16px;
    border-radius: 8px;
    outline: 2px solid #242936;
    font-size: 0px;
    user-select: none;
    flex-grow: 0;
    flex-shrink: 0;

    &-img {
      width: inherit;
      height: inherit;
      border-radius: inherit;
      object-fit: cover;
    }

    &__no-avatar {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 28px;
      line-height: 28px;
      color: gray;
    }
  }
</style>
