<script setup>
  import { useGlobalNotificationStore } from "@/stores/global-notification-store";
  import CheckMain from "./svg/CheckMain.vue";
  import XmarkMain from "./svg/XmarkMain.vue";

  const globalNotificationStore = useGlobalNotificationStore();
</script>

<template>
  <div
    class="global-notification"
    :class="{ error: globalNotificationStore.isErrorNotification }"
    @click="globalNotificationStore.hideNotification"
  >
    <span
      ><CheckMain
        v-if="!globalNotificationStore.isErrorNotification"
        class="global-notification__icon global-notification__icon--success"
      />
      <XmarkMain
        v-else
        class="global-notification__icon global-notification__icon--err"
      />
    </span>
    <span class="global-notification__msg">
      {{ globalNotificationStore.notificationMsg }}
    </span>
  </div>
</template>

<style scoped lang="scss">
  .global-notification {
    position: fixed;
    width: 400px;
    top: 100px;
    right: 20px;
    padding: 12px 24px 14px 24px;
    color: snow;
    font-family: monospace;
    line-height: 28px;
    background-color: green;
    border-radius: 16px;
    cursor: pointer;
    z-index: 999999;

    @media (max-width: 999.98px) {
      width: 320px;
      padding: 6px 12px;
      right: 8px;
      font-size: 0.8em;
      line-height: 0.8em;
    }

    &.error {
      background-color: #b91c1c;
    }

    &__icon {
      width: 28px;
      height: 28px;
      margin-right: 8px;

      &--err {
        > * {
          fill: darkgrey;
        }
      }
    }

    &__msg {
      vertical-align: middle;
    }
  }
</style>
