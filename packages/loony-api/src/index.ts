import { app, server } from "./init"
import config from "./config"
import aegis from "./aegis"

const { PORT } = config
// Middleware
app.use(aegis)

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
