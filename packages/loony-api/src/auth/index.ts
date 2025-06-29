import express, { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import pool from "../db"
import config from "../config"

const { SECRET_KEY } = config
const router = express.Router()

// Register
router.post("/register", async (req: Request, res: Response) => {
  const { username, password, fname, lname } = req.body
  try {
    const userExists = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    )
    if (userExists.rows.length > 0)
      res.status(400).json({ msg: "User already exists" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await pool.query(
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
    const userRows = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username],
    )
    if (userRows.rows.length === 0)
      res.status(400).json({ msg: "Invalid credentials" })

    const user = userRows.rows[0]
    const valid = await bcrypt.compare(password, user.password)
    if (!valid) res.status(400).json({ msg: "Invalid credentials" })

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        fname: user.fname,
        lname: user.lname,
      },
      SECRET_KEY,
      {
        expiresIn: "6h",
      },
    )
    res.cookie("AUTH_TOKEN", token, {
      httpOnly: true,
      secure: false, // true if HTTPS
      sameSite: "lax",
    })
    res.json({ token })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/session", async (req: any, res: any) => {
  const token = req.cookies.AUTH_TOKEN
  if (!token) return res.status(401).json({ message: "Unauthorized" })

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    res.json({
      loggedIn: true,
      user: decoded,
    })
  } catch {
    res.status(403).json({ message: "Invalid token" })
  }
})

router.post("/logout", async (req: any, res: any) => {
  res.clearCookie("AUTH_TOKEN")
  res.json({})
})

export default router
