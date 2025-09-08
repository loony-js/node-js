import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
// import dotenv from "dotenv"

// dotenv.config()

export default defineConfig({
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
