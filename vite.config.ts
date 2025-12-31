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
    // 업데이트 시각 (환경변수에서 가져오거나 빈 문자열)
    __UPDATE_TIME__: JSON.stringify(process.env.UPDATE_TIME || ""),
  },
});
