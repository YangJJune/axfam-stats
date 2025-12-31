import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Cache-Control": "no-store",
    },
  },
  define: {
    // 빌드 시점의 타임스탬프를 전역 상수로 정의
    __BUILD_TIMESTAMP__: JSON.stringify(Date.now().toString()),
  },
});
