import jwt from "jsonwebtoken"
import config from "../config"

const { SECRET_KEY } = config

function authMiddleware(req: any, res: any, next: any) {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json({ message: "Unauthorized" })

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    req.user = decoded
    next()
  } catch {
    res.status(403).json({ message: "Invalid token" })
  }
}

export default authMiddleware
