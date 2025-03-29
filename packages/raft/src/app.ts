import express from "express"
import http from "http"
import { WS_CLIENTS } from "./config"
import onShutdownServer from "./events/shutdown"

const app = express()
const server = http.createServer(app)

onShutdownServer(server, WS_CLIENTS)

export { app, server }
