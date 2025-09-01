import { app, server } from "./init"
import config from "./config"
import auth from "./auth"

const { PORT } = config

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

app.use(auth)

app.get("/hello", (req, res) => {
  res.send("Hello, Express!")
})

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
