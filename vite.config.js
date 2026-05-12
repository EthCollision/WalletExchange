import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";

export default defineConfig({
  plugins: [uni()],
  define: {
    global: "globalThis",
  },
  server: {
    host: "localhost", // 指定服务器应该监听哪个IP地址,默认：localhost
    port: 5173, // 指定开发服务器端口,默认：5173
    proxy: {
      // 为开发服务器配置自定义代理规则
      "/api": {
        target: "http://h5.coinglobal.cc", // 目标接口
        changeOrigin: true, // 是否换源
        rewrite: (path) => path.replace(/^\/api/, "/api"),
      },
    },
  },
});
