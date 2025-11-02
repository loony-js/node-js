const fetch = require("node-fetch")

const dependencies = [
  "tailwindcss",
  "axios",
  "dotenv",
  "lightweight-charts",
  "lucide-react",
  "pg",
  "react",
  "react-dom",
  "react-icons",
  "react-router",
  "speechmatics",
]

const dev_dependencies = [
  "@tailwindcss/postcss",
  "@biomejs/biome",
  "@eslint/compat",
  "@eslint/js",
  "@rsbuild/core",
  "@rsbuild/plugin-react",
  "@types/pg",
  "@types/react",
  "@types/react-dom",
  "autoprefixer",
  "eslint",
  "eslint-plugin-react",
  "eslint-plugin-react-hooks",
  "globals",
  "postcss",
  "prettier",
  "typescript",
  "typescript-eslint",
]

async function getLatestVersion(pkg) {
  const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`)
  if (!res.ok) throw new Error(`Failed to fetch ${pkg}`)
  const data = await res.json()
  return { name: pkg, version: data.version }
}

async function main() {
  const deps_results = await Promise.all(dependencies.map(getLatestVersion))
  console.table(deps_results)
  const dev_deps_results = await Promise.all(
    dev_dependencies.map(getLatestVersion),
  )
  console.table(dev_deps_results)
}

main()
