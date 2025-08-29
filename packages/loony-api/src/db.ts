import { Pool } from "pg"

const authPool = new Pool({
  connectionString: process.env.AUTH_DATABASE_URL,
})

const appPool = new Pool({
  connectionString: process.env.APP_DATABASE_URL,
})

function initPool() {
  return authPool
    .query("SELECT 1")
    .then(() => {
      console.log("✅ Database connected successfully")
    })
    .catch((err) => {
      console.error("❌ Failed to connect to the database:", err)
      process.exit(1) // Abort if DB is not reachable
    })
}

// Export a promise that resolves to a working pool
initPool()

export { authPool, appPool }
