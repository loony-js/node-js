import express from "express"
import https from "https"
import cors from "cors"
import cookieParser from "cookie-parser"
import fs from "fs"
import config from "./config"

const { KEY_PATH, CERT_PATH, ALLOW_ORIGIN } = config
const options = {
  key: fs.readFileSync(KEY_PATH), // or localhost.key
  cert: fs.readFileSync(CERT_PATH), // or localhost.crt
}

const app = express()

app.use(
  cors({
    origin: ALLOW_ORIGIN, // frontend origin
    methods: ["GET", "POST"],
    allowedHeaders: [
      "Content-Type",
      "Accept",
      "Authorization",
      "access-control-allow-origin",
    ],
    credentials: true, // 🔥 allow cookies to be sent,
  }),
)
// app.use(
//   session({
//     secret: SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     cookie: { secure: false },
//   }),
// )
app.use(cookieParser())
app.use(express.json())
const server = https.createServer(options, app)

export { app, server, config }
