import express from "express"
import session from "express-session"
import http from "http"
import cors from "cors"
import cookieParser from "cookie-parser"

import config from "./config"

const { SECRET_KEY } = config
const app = express()

app.use(
  cors({
    origin: "http://localhost:3000", // frontend origin
    credentials: true, // 🔥 allow cookies to be sent
  }),
)
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
)
app.use(cookieParser())
app.use(express.json())
const server = http.createServer(app)

export { app, server, config }
