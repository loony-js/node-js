import { app, server } from "./init"
import config from "./config"
import express from "express"
import creds from "./creds"
import crypto from "./crypto"

const { PORT } = config
// Middleware
app.use(express.json())
app.use(creds)
app.use(crypto)

// Simple Route
app.get("/", (req, res) => {
  res.send("Hello, Express!")
})

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
