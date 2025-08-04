import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  preview: {
    host: "0.0.0.0",
    port: process.env.PORT,
    allowedHosts: ["agriculture-and-animals-3.onrender.com"],
  },
});
