export default {
  beforeMount(el) {
    const handler = e => {
      const cleaned = el.value.replace(/\D/g, "");
      if (el.value !== cleaned) {
        el.value = cleaned;
        el.dispatchEvent(new Event("input"));
      }
    };
    el.addEventListener("input", handler);
  },
};
