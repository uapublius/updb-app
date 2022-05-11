import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        {
          "@vueuse/core": ["useMouse", ["useFetch", "useMyFetch"]],
          axios: [["default", "axios"]],
          "[package-name]": ["[import-names]", ["[from]", "[alias]"]]
        }
      ]
    }),
    Components()
  ],
  build: {
    chunkSizeWarningLimit: 1024
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  server: {
    proxy: {
      "/api/reports": {
        target: "http://127.0.0.1:4000",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/reports/, "")
      },
      "/api/docs": {
        target: "http://127.0.0.1:4010",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/docs/, "")
      }
    }
  }
});
