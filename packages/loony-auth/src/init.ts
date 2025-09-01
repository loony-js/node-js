// import http from "http"
import express from "express"
import session from "express-session"
import cors from "cors"
import cookieParser from "cookie-parser"
import fs from "fs"
import https from "https"
import config from "./config"

const { SECRET_KEY, KEY_PATH, CERT_PATH } = config
const options = {
  key: fs.readFileSync(KEY_PATH), // or localhost.key
  cert: fs.readFileSync(CERT_PATH), // or localhost.crt
}

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
const server = https.createServer(options, app)

export { app, server, config }
