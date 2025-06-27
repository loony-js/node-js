import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"

export default defineConfig({
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
