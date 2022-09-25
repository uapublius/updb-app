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
    host: '0.0.0.0',
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
      },
      "/api/maps": {
        target: "https://api.maptiler.com",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/maps/, "")
      }
    }
  }
});
