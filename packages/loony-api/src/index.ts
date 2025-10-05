import { app, server } from "./init"
import config from "./config"
import aegis from "./aegis"
import authMiddleware from "./middleware"

const { APP_PORT } = config
// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

app.get("/hello", (req, res) => {
  res.send("Hello, Express!")
})

// Middleware
app.use("/aegis", authMiddleware, aegis)

// Start Server
server.listen(APP_PORT, () => {
  console.log(`Server is running on http://localhost:${APP_PORT}`)
})
