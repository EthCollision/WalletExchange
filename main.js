import App from "./App";
import { createSSRApp } from "vue";
import { createPinia } from "pinia";

import uView from "./uni_modules/vk-uview-ui";

export function createApp() {
  const app = createSSRApp(App);
  const pinia = createPinia();

  // 使用 uView UI
  app.use(uView);
  app.use(pinia);

  return {
    app,
  };
}
