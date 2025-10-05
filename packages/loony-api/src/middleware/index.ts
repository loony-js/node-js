import jwt from "jsonwebtoken"

export const verifyAccessToken = (token: string, secretKey: string) => {
  try {
    const claims = jwt.verify(token, secretKey, {
      algorithms: ["HS256"],
      issuer: "loony-auth",
      audience: "loony-auth",
      ignoreNotBefore: true, // 👈 skip strict nbf validation
    })
    return claims
  } catch (err: any) {
    throw new Error(`Invalid token: ${err.message}`)
  }
}

function authMiddleware(req: any, res: any, next: any) {
  const token = req.cookies.access_token
  if (!token) return res.status(401).json({ message: "Unauthorized" })
  const secret_key = process.env.SECRET_KEY
  try {
    const user = verifyAccessToken(token, secret_key || "")
    req.user = user
    next()
  } catch (err: any) {
    console.log(err)
    res.status(403).json({ message: "Authentication failed. Invalid token" })
  }
}

export default authMiddleware
