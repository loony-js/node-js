import express, { Request, Response } from "express"
import { encrypt, decrypt } from "loony-sdk"
import { appPool } from "./db"

const router = express.Router()

// GET all users
router.get("/all", async (req: Request, res: Response) => {
  try {
    const result = await appPool.query("SELECT * FROM aegis")
    res.json(result.rows)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/:name", async (req: Request, res: Response) => {
  try {
    const { name } = req.params
    const result = await appPool.query("SELECT * FROM aegis WHERE name = $1", [
      name,
    ])
    res.json(result.rows[0])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// POST new user
router.post("/encrypt", async (req: Request, res: Response) => {
  try {
    const { name, url, username, password, master_password } = req.body
    const encryptedText = await encrypt(password, master_password)

    const result = await appPool.query(
      "INSERT INTO aegis (name, url, username, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, url, username, encryptedText.toString("base64")],
    )
    res.status(201).json(result.rows[0])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

router.post("/decrypt", async (req: Request, res: Response) => {
  try {
    const { password, master_password } = req.body
    const ori_password = await decrypt(
      Buffer.from(password, "base64"),
      master_password,
    )
    res.status(201).json({ password: ori_password.toString("utf-8") })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// PUT update user
router.put("/update/:id", async (req: Request, res: Response) => {
  try {
    const { password } = req.body
    const { id } = req.params
    const result = await appPool.query(
      "UPDATE aegis SET password = $1 WHERE id = $2 RETURNING *",
      [password, id],
    )
    res.json(result.rows[0])
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE user
router.post("/delete/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await appPool.query("DELETE FROM aegis WHERE id = $1", [id])
    res.json({ message: "ok" })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

export default router
