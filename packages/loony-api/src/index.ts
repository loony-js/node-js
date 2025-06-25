import express from "express"
import http from "http"
import dotenv from "dotenv"
import { encrypt, decrypt } from "loony-sdk"

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

app.post("/encrypt", (req, res) => {
  const { text, password } = req.body
  const encryptedText = encrypt(text, password)
  res.send({ text: encryptedText })
})

app.post("/decrypt", (req, res) => {
  try {
    const { text, password } = req.body
    const result = decrypt(text, password)
    res.send({ text: result })
  } catch (error) {
    res.send({ text: error })
  }
})

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
