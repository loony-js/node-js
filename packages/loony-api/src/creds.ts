import express, { Request, Response } from "express"
import { encrypt } from "loony-sdk"
import db from "./db"

const router = express.Router()

// GET all users
router.get("/creds", async (req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM creds")
    res.json(result.rows)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// GET user by ID
router.get("/creds/:name", async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    const result = await db.query("SELECT * FROM creds WHERE name = $1", [name])
    res.json(result.rows[0])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// POST new user
router.post("/encrypt", async (req: Request, res: Response) => {
  try {
    const { name, username, password, master_password } = req.body
    const encryptedText = encrypt(password, master_password)

    const result = await db.query(
      "INSERT INTO creds (name, username, password) VALUES ($1, $2, $3) RETURNING *",
      [name, username, encryptedText],
    )
    res.status(201).json(result.rows[0])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update user
router.put("/updateHash/:id", async (req: Request, res: Response) => {
  try {
    const { hashed_text, password } = req.body
    const { id } = req.params
    const result = await db.query(
      "UPDATE creds SET hashed_text = $1, password = $2 WHERE id = $3 RETURNING *",
      [hashed_text, password, id],
    )
    res.json(result.rows[0])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE user
router.delete("/creds/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await db.query("DELETE FROM creds WHERE id = $1", [id])
    res.status(204).send()
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
