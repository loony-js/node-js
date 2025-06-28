import dotenv from "dotenv"
dotenv.config()

const PORT = process.env.PORT || 2000
const DATABASE_URL = process.env.DATABASE_URL
const SECRET_KEY = process.env.SECRET_KEY || ""

export default { PORT, DATABASE_URL, SECRET_KEY }
