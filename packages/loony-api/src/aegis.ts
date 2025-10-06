import express, { Request, Response } from "express"
import { encrypt, decrypt } from "loony-sdk"
import { appPool } from "./db"

const router = express.Router()

// GET all users
router.get("/:user_id/all", async (req: any, res: any) => {
  const { user_id } = req.params
  try {
    const result = await appPool.query("SELECT * FROM aegis where user_id=$1", [
      user_id,
    ])
    res.json(result.rows)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

router.get("/:aegis_id/get", async (req: Request, res: Response) => {
  try {
    const { aegis_id } = req.params
    const result = await appPool.query(
      `SELECT a.uid AS aegis_id, kv.key, kv.value
        FROM aegis a
        LEFT JOIN aegis_key_value kv ON a.uid = kv.aegis_id
        WHERE a.uid = $1`,
      [aegis_id],
    )
    res.json(result.rows)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
})

// POST new user
router.post("/encrypt", async (req: any, res: Response) => {
  try {
    const { user_id, name, password, master_password, inputs } = req.body
    const pool = await appPool.connect()

    await pool.query("BEGIN")
    const aegisRes = await pool.query(
      "INSERT INTO aegis (user_id, name) VALUES ($1, $2) RETURNING uid",
      [user_id, name],
    )
    const aegisId = aegisRes.rows[0].uid

    if (password && master_password) {
      const encryptedText = await encrypt(password, master_password)
      await pool.query(
        "INSERT INTO aegis_key_value (aegis_id, key, value) VALUES ($1, $2, $3)",
        [aegisId, "password", encryptedText.toString("base64")],
      )
    }

    const insertPromises = Object.entries(inputs).map(async ([key, value]) => {
      return pool.query(
        "INSERT INTO aegis_key_value (aegis_id, key, value) VALUES ($1, $2, $3)",
        [aegisId, key, value],
      )
    })

    await Promise.all(insertPromises)
    await pool.query("COMMIT")

    res.status(201).json({
      aegisId,
    })
  } catch (err: any) {
    console.log(err)
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
