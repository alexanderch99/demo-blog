<script setup>
  import { useRoute } from "vue-router";
  import HeaderMain from "./components/HeaderMain.vue";
  import FooterMain from "./components/FooterMain.vue";
  import GlobalNotification from "./components/GlobalNotification.vue";
  import { useGlobalNotificationStore } from "./stores/global-notification-store";

  const globalNotificationStore = useGlobalNotificationStore();

  const route = useRoute();
</script>

<template>
  <div id="modals"></div>
  <GlobalNotification v-if="globalNotificationStore.isNotificationVisible" />
  <HeaderMain v-if="!route.fullPath.startsWith('/admin')" />
  <p>test 3</p>
  <main
    class="main"
    :style="
      route.fullPath.startsWith('/admin')
        ? { margin: '0px', minHeight: 'calc(100vh - 80px)' }
        : { margin: '80px 0px', minHeight: 'calc(100vh - 320px)' }
    "
  >
    <RouterView />
  </main>
  <FooterMain />
</template>

<style scoped lang="scss">
  .main {
    min-height: calc(100vh - 320px);
    margin: 80px 0px;
  }
</style>
