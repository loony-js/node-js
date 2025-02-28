Here's an **advanced** `tsconfig.json` that provides enhanced control over TypeScript compilation, including optimizations, aliasing, and strict type checking.

### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictPropertyInitialization": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowJs": false,
    "checkJs": false,
    "isolatedModules": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "baseUrl": "./src",
    "paths": {
      "@utils/*": ["utils/*"],
      "@models/*": ["models/*"],
      "@controllers/*": ["controllers/*"]
    },
    "incremental": true,
    "composite": false
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

---

## 🔹 **Explanation of Key Advanced Options**

| Option                           | Description                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `"target": "ESNext"`             | Generates modern JavaScript code, using the latest ES features.                            |
| `"module": "NodeNext"`           | Uses Node.js ESM (`import/export`) module system for compatibility.                        |
| `"moduleResolution": "NodeNext"` | Ensures compatibility with Node.js module resolution.                                      |
| `"strict": true`                 | Enables all strict type-checking options.                                                  |
| `"noImplicitAny": true`          | Disallows variables with `any` type unless explicitly typed.                               |
| `"strictNullChecks": true`       | Ensures `null` and `undefined` are strictly checked.                                       |
| `"noUnusedLocals": true`         | Errors on declared but unused local variables.                                             |
| `"noImplicitReturns": true`      | Ensures every function has a return statement.                                             |
| `"esModuleInterop": true`        | Allows default imports from CommonJS modules.                                              |
| `"resolveJsonModule": true`      | Allows importing `.json` files.                                                            |
| `"isolatedModules": true`        | Ensures each file is treated as an independent module (useful for build tools like Babel). |
| `"experimentalDecorators": true` | Enables decorators (useful in frameworks like NestJS).                                     |
| `"emitDecoratorMetadata": true`  | Enables metadata reflection for decorators (useful in TypeORM/NestJS).                     |
| `"sourceMap": true`              | Generates source maps for debugging.                                                       |
| `"declaration": true`            | Generates `.d.ts` files for TypeScript definitions.                                        |
| `"declarationMap": true`         | Generates source maps for `.d.ts` files, helping in navigation.                            |
| `"baseUrl": "./src"`             | Allows absolute imports from `src/`.                                                       |
| `"paths"`                        | Defines import aliases (e.g., `@utils/` maps to `src/utils/`).                             |
| `"incremental": true`            | Speeds up recompilation by using incremental builds.                                       |
| `"composite": false`             | Used for project references (set to `true` if using monorepos).                            |

---

## 🔹 **How to Use**

### 1️⃣ **Initialize a TypeScript project**

```sh
tsc --init
```

This creates a default `tsconfig.json`, which you can replace with the advanced version.

### 2️⃣ **Compile TypeScript**

```sh
tsc
```

This compiles all `.ts` files from `src/` to `dist/`.

### 3️⃣ **Run the Compiled JavaScript**

```sh
node dist/index.js
```

---

### 🔹 **Additional Notes**

- If you want to use `ESM` (`import/export`) in **Node.js**, ensure your `package.json` contains:
  ```json
  {
    "type": "module"
  }
  ```
- If you need **CommonJS**, change `"module": "CommonJS"`.
- If you use **Babel**, `"isolatedModules": true` is required.

---

### 🚀 **Ideal For:**

✅ **Node.js backends** (NestJS, Express)  
✅ **Large-scale TypeScript projects**  
✅ **Optimized builds with strict checks**

Let me know if you need customizations! 🔥
