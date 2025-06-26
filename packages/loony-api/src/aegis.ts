import express, { Request, Response } from "express"
import { encrypt, decrypt } from "loony-sdk"
import db from "./db"

const router = express.Router()

// GET all users
router.get("/aegis/all", async (req: Request, res: Response) => {
  try {
    const result = await db.query("SELECT * FROM aegis")
    res.json(result.rows)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/aegis/:name", async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    const result = await db.query("SELECT * FROM aegis WHERE name = $1", [name])
    res.json(result.rows[0])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// POST new user
router.post("/aegis/encrypt", async (req: Request, res: Response) => {
  try {
    const { name, username, password, master_password } = req.body
    const encryptedText = encrypt(password, master_password)

    const result = await db.query(
      "INSERT INTO aegis (name, username, password) VALUES ($1, $2, $3) RETURNING *",
      [name, username, encryptedText],
    )
    res.status(201).json(result.rows[0])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

router.post("/aegis/decrypt", async (req: Request, res: Response) => {
  try {
    const { password, master_password } = req.body
    const ori_password = decrypt(password, master_password)
    res.status(201).json({ password: ori_password })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update user
router.put("/aegis/updateHash/:id", async (req: Request, res: Response) => {
  try {
    const { hashed_text, password } = req.body
    const { id } = req.params
    const result = await db.query(
      "UPDATE aegis SET hashed_text = $1, password = $2 WHERE id = $3 RETURNING *",
      [hashed_text, password, id],
    )
    res.json(result.rows[0])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE user
router.post("/aegis/delete/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await db.query("DELETE FROM aegis WHERE id = $1", [id])
    res.json({ message: "ok" })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
