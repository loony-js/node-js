import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"

export default defineConfig({
  server: {
    port: (process.env.APP_PORT && parseInt(process.env.APP_PORT)) || 3033,
    strictPort: true,
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
