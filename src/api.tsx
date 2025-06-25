const express = require("express")
const http = require("http")
const dotenv = require("dotenv")

dotenv.config()
const PORT = process.env.PORT || 2000
const app = express()
const server = http.createServer(app)

// Middleware
app.use(express.json())

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
