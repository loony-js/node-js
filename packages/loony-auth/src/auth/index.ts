import express, { Request, Response } from "express"
import bcrypt from "bcrypt"
import { authPool } from "../db"
import {
  sendAccessToken,
  sendRefreshToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  // verifyAccessToken,
  verifyRefreshToken,
} from "./utils"

const router = express.Router()

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, fname, lname } = req.body
  try {
    const userExists = await authPool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    )
    if (userExists.rows.length > 0)
      res.status(400).json({ msg: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await authPool.query(
      "INSERT INTO users (fname, lname, username, password) VALUES ($1, $2, $3, $4) RETURNING id, username",
      [fname, lname, username, hashedPassword],
    )
    res.json(newUser.rows[0])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// Login
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body
  try {
    const userRows = await authPool.query(
      "SELECT uid, password FROM users WHERE username = $1",
      [username],
    )
    if (userRows.rows.length === 0) {
      res.status(400).json({ msg: "Invalid credentials" })
      return
    }

    const user = userRows.rows[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      res.status(400).json({ msg: "Invalid credentials" })
      return
    }

    sendAccessToken(res, signAccessToken({ uid: user.uid }))
    sendRefreshToken(res, signRefreshToken({ uid: user.uid }))

    res.json({ message: "LoggedIn successfully." })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// router.get("/session", async (req: any, res: any) => {
//   const access_token = req.cookies.access_token
//   if (!access_token)
//     return res.status(401).json({ message: "Session expired." })

//   try {
//     const user = verifyAccessToken(access_token)
//     res.json({
//       loggedIn: true,
//       user,
//     })
//   } catch {
//     res.status(403).json({ message: "Invalid token" })
//   }
// })

// Refresh token
router.post("/refreshToken", async (req: any, res: any) => {
  try {
    const refresh_token = req.cookies.refresh_token
    if (!refresh_token) {
      return res.status(401).json({ message: "No refresh token" })
    }
    //
    let payload: any
    try {
      payload = verifyRefreshToken(refresh_token)
    } catch {
      return res.status(401).json({ message: "Invalid refresh token" })
    }
    // const user = await User.findById(payload.sub)
    // if (!user) return res.status(401).json({ message: "User not found" })
    // // check token exists in DB
    // if (!user.refreshTokens.includes(token))
    //   return res.status(401).json({ message: "Refresh token revoked" })

    // // Rotate tokens: remove old refresh token, issue new pair
    // user.refreshTokens = user.refreshTokens.filter((t) => t !== token)
    const newRefresh = signRefreshToken({ uid: payload.uid })
    // user.refreshTokens.push(newRefresh)
    // await user.save()

    const newAccessToken = signAccessToken({
      uid: payload.uid,
    })
    sendRefreshToken(res, newRefresh)
    sendAccessToken(res, newAccessToken)
    res.json({ newAccessToken })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

router.post("/logout", async (req: any, res: any) => {
  res.clearCookie("refresh_token", {
    httpOnly: true,
    secure: true, // must match
    sameSite: "none", // must match
    // path and domain must match too if you customized them
    // path: "/",
    // domain: "localhost",
  })
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true, // must match how you set it
    sameSite: "none", // must match how you set it
  })
  res.status(200).json({ message: "Logged out successfully" })
})

router.get("/userInfo", async (req: any, res: any) => {
  try {
    const access_token = req.cookies.access_token
    if (!access_token) {
      return res.status(401).json({ message: "No access token" })
    }
    const payload: any = verifyAccessToken(access_token)
    const userRows = await authPool.query(
      "SELECT uid, fname, lname FROM users WHERE uid = $1",
      [payload.uid],
    )
    if (userRows.rows.length === 0) {
      res.status(404).json({ msg: "User not found." })
      return
    }

    const user = userRows.rows[0]

    res.status(200).json(user)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
})

export default router
