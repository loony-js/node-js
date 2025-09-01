import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 2000
const DATABASE_URL = process.env.DATABASE_URL
const SECRET_KEY = process.env.SECRET_KEY || ""
const KEY_PATH = process.env.KEY_PATH || ""
const CERT_PATH = process.env.CERT_PATH || ""

export default { PORT, DATABASE_URL, SECRET_KEY, KEY_PATH, CERT_PATH }
