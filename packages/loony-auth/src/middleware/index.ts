import { verifyAccessToken } from "../auth/utils"

function authMiddleware(req: any, res: any, next: any) {
  const access_token = req.cookies.access_token
  if (!access_token) return res.status(401).json({ message: "Unauthorized" })

  try {
    const user = verifyAccessToken(access_token)
    req.user = user
    next()
  } catch {
    res.status(403).json({ message: "Authentication failed. Invalid token" })
  }
}

export default authMiddleware
