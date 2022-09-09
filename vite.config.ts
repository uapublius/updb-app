import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";
import svgLoader from "vite-svg-loader";

export default defineConfig({
  plugins: [
    vue({
      reactivityTransform: true
    }),
    svgLoader(),
    AutoImport({
      imports: [
        "vue",
        "vue-router"
      ]
    }),
    Components()
  ],
  build: {
    chunkSizeWarningLimit: 1024,
    rollupOptions: {
      manualChunks: {
        'mapbox-gl': ['mapbox-gl']
      },
      output: {
        inlineDynamicImports: false
      }
    }
  },
  resolve: {
    alias: {
      "@": "/src"
    }
  },
  server: {
    proxy: {
      "/api/maps": {
        target: "https://api.maptiler.com",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/maps/, "")
      }
    }
  }
});
