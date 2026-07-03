import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Vite config with a dev proxy so /api calls go straight to the backend.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://sevasaathi-2ctk.onrender.com/api",
        changeOrigin: true,
      },
    },
  },
});
