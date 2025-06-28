import { app, server } from "./init"
import config from "./config"
import aegis from "./aegis"
import auth from "./auth"

const { PORT } = config
// Middleware
app.use(aegis)
app.use("/auth", auth)

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
