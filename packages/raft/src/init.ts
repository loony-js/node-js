import express from "express"
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"

import config from "./config"

const app = express()

app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true, // 🔥 allow cookies to be sent
  }),
)
app.use(cookieParser())
app.use(express.json())
const server = http.createServer(app)

export { app, server, config }
