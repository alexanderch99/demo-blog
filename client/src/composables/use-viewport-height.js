import { onMounted, onBeforeUnmount } from "vue";

export function useViewportHeight() {
  function setVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  onMounted(() => {
    setVh();
    window.addEventListener("resize", setVh);
    window.addEventListener("orientationchange", setVh);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("resize", setVh);
    window.removeEventListener("orientationchange", setVh);
  });
}

/*
CSS:

height: 100vh;
height: calc(var(--vh, 1vh) * 100);
*/
