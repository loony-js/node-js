import { app, server } from "./init"
import config from "./config"
import aegis from "./aegis"
import auth from "./auth"
import authMiddleware from "./middleware"

const { PORT } = config

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

app.use(auth)

app.get("/hello", (req, res) => {
  res.send("Hello, Express!")
})

// Middleware
app.use("/aegis", authMiddleware, aegis)

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
