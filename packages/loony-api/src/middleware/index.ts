import jwt from "jsonwebtoken"

export const verifyAccessToken = (payload: string) => {
  return jwt.verify(payload, process.env.JWT_ACCESS_SECRET || "")
}

function authMiddleware(req: any, res: any, next: any) {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json({ message: "Unauthorized" })

  try {
    const user = verifyAccessToken(token)
    req.user = user
    next()
  } catch {
    res.status(403).json({ message: "Authentication failed. Invalid token" })
  }
}

export default authMiddleware
