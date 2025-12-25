/* eslint-disable no-undef */
/* eslint-env node */
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = (env.VITE_API_BASE_URL || "http://localhost:8080").replace(
    "/api/v1",
    ""
  );

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // <-- thêm dòng này
      },
    },
    server: {
      proxy: {
        "/api": {
          target,
          changeOrigin: true,
          secure: false,
          cookieDomainRewrite: "", 
          configure: (proxy, options) => {
            proxy.on("proxyRes", function (proxyRes) {
              const key = "set-cookie";
              if (proxyRes.headers[key]) {
                proxyRes.headers[key] = proxyRes.headers[key].map((cookie) =>
                  cookie.replace(/; secure/gi, "")
                );
              }
            });
          },
        },
      },
    },
  };
});
