import express from "express"
import session from "express-session"
import http from "http"
import cors from "cors"

import config from "./config"

const { SECRET_KEY } = config
const app = express()

app.use(cors())
app.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
)
app.use(express.json())
const server = http.createServer(app)

export { app, server, config }
