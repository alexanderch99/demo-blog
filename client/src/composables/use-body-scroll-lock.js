import { onMounted, onUnmounted } from "vue";

let lockCount = 0;
let originalOverflow = "";

export function useBodyScrollLock() {
  onMounted(() => {
    if (lockCount === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
    lockCount++;
  });

  onUnmounted(() => {
    lockCount--;
    if (lockCount === 0) {
      document.body.style.overflow = originalOverflow || "";
    }
  });
}
