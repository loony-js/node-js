import express from "express"
import http from "http"
import cors from "cors"

import config from "./config"

const app = express()

app.use(cors())
app.use(express.json())
const server = http.createServer(app)

export { app, server, config }
