import { Pool } from "pg"
import config from "./config"

const appPool = new Pool({
  connectionString: config.APP_DATABASE_URL,
})

function initPool() {
  return appPool
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

export { appPool }
