import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 💡 주소를 잃어버렸을 때 index.html로 안전하게 되돌려주는 옵션이야!
    historyApiFallback: true,
  },
});
