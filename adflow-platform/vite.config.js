// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  server: {
    allowedHosts: [
      "all",
      "fde0ff5e-ace0-4904-a272-baaace75b6ef-00-1t0iztahd7w8u.pike.replit.dev",
      // You can add more domains if needed
    ],
  },
});
