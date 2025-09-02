import jwt from "jsonwebtoken"

export const signAccessToken = (payload: string | object) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET || "", {
    expiresIn: "30Minutes",
  })
}

export const verifyAccessToken = (payload: string) => {
  return jwt.verify(payload, process.env.JWT_ACCESS_SECRET || "")
}

export const signRefreshToken = (payload: string | object) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || "", {
    expiresIn: "24Hours",
  })
}

export const verifyRefreshToken = (payload: string) => {
  return jwt.verify(payload, process.env.JWT_REFRESH_SECRET || "")
}

export const sendAccessToken = (res: any, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // lax, none, strict
    // domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 1000 * 60 * 30, // 15 minutes
  }
  res.cookie("access_token", token, cookieOptions)
}

export const sendRefreshToken = (res: any, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none", // lax, none, strict
    // domain: process.env.COOKIE_DOMAIN || undefined,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  }
  res.cookie("refresh_token", token, cookieOptions)
}
