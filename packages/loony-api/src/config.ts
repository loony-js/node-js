import dotenv from "dotenv"
dotenv.config()

const APP_PORT = process.env.APP_PORT
const APP_DATABASE_URL = process.env.APP_DATABASE_URL
const SECRET_KEY = process.env.SECRET_KEY || ""
const KEY_PATH = process.env.KEY_PATH || ""
const CERT_PATH = process.env.CERT_PATH || ""
const ALLOW_ORIGIN = process.env.ALLOW_ORIGIN

export default {
  APP_PORT,
  APP_DATABASE_URL,
  SECRET_KEY,
  KEY_PATH,
  CERT_PATH,
  ALLOW_ORIGIN,
}
