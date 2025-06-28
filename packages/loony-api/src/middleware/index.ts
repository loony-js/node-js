import jwt from "jsonwebtoken"
import { NextFunction, Response } from "express"
import config from "../config"

const { SECRET_KEY } = config

function authMiddleware(req: any, res: Response, next: NextFunction) {
  const token = req.header("Authorization")?.split(" ")[1]
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" })

  try {
    const decoded = jwt.verify(token, SECRET_KEY).toString()
    req.user = decoded
    next()
  } catch {
    res.status(400).json({ msg: "Token is not valid" })
  }
}

export default authMiddleware
