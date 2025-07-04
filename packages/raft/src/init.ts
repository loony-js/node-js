import express from "express"
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"

import config from "./config"

const app = express()

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
)
app.use(cookieParser())
app.use(express.json())
const server = http.createServer(app)

export { app, server, config }
