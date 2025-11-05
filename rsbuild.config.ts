import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import fs from "fs"

export default defineConfig({
  server: {
    port: (process.env.APP_PORT && parseInt(process.env.APP_PORT)) || 5000,
    strictPort: true,
    https: {
      key: fs.readFileSync("./.local/localhost-key.pem"),
      cert: fs.readFileSync("./.local/localhost.pem"),
    },
  },
  source: {
    define: {
      "process.env": JSON.stringify(process.env),
    },
  },
  plugins: [pluginReact()],
  html: {
    template: "./public/index.html",
  },
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [require("@tailwindcss/postcss"), require("autoprefixer")],
      },
    },
  },
})
