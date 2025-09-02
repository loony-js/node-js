// import http from "http"
// import session from "express-session"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import fs from "fs"
import https from "https"
import config from "./config"

const { KEY_PATH, CERT_PATH } = config
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

// app.use(
//   session({
//     name: "connect.sid", // default name, can change
//     secret: SECRET_KEY,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       httpOnly: true,
//       secure: true, // required for HTTPS
//       sameSite: "none", // required if frontend != backend
//       // maxAge: 1000 * 60 * 60 * 24, // 1 day
//       maxAge: 1000 * 60 * 60 * 6, // 24hour,
//     },
//   }),
// )
app.use(cookieParser())
app.use(express.json())
const server = https.createServer(options, app)

export { app, server, config }
