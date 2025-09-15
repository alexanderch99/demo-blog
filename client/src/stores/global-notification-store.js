import { ref } from "vue";
import { defineStore } from "pinia";

export const useGlobalNotificationStore = defineStore(
  "globalNotification",
  () => {
    const isNotificationVisible = ref(false);
    const notificationMsg = ref("");
    const isErrorNotification = ref(false);
    const isCdOut = ref(true);
    let timeout;

    function showNotification(msg, isError) {
      isNotificationVisible.value = true;
      isErrorNotification.value = isError;

      if (Array.isArray(msg)) {
        notificationMsg.value = msg.map(el => el.msg).join`, `;
      } else {
        notificationMsg.value = msg;
      }

      function startTimeout() {
        timeout = setTimeout(() => {
          isNotificationVisible.value = false;
          isCdOut.value = true;
        }, 7000);
      }

      if (isCdOut.value) {
        startTimeout();
      } else {
        clearTimeout(timeout);
        startTimeout();
      }

      isCdOut.value = false;
    }

    function hideNotification() {
      isNotificationVisible.value = false;
      isCdOut.value = true;
    }

    return {
      showNotification,
      hideNotification,
      isNotificationVisible,
      notificationMsg,
      isErrorNotification,
    };
  },
);
