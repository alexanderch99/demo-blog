import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import vNumeric from "./directives/v-numeric";

const app = createApp(App);

app.directive("numeric", vNumeric);

app.use(createPinia());
app.use(router);

router.isReady().then(() => {
  app.mount("#app");
});
