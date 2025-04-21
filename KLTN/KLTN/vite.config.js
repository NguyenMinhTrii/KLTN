// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react-swc";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// });

// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000", // trỏ về backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
