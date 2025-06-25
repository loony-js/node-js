import express from "express"
import http from "http"
import config from "./config"

const app = express()
const server = http.createServer(app)

export { app, server, config }
