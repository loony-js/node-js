import { app, server } from "./init"
import config from "./config"
import aegis from "./aegis"
import auth from "./auth"
import authMiddleware from "./middleware"

const { PORT } = config
// Middleware
app.use(aegis)
app.use(auth)

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

app.get("/hello", authMiddleware, (req, res) => {
  res.send("Hello, Express!")
})

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
