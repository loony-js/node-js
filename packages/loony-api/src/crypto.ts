import express, { Request, Response } from "express"
import { encrypt, decrypt } from "loony-sdk"
const router = express.Router()

router.post("/encrypt", (req: Request, res: Response) => {
  const { text, password } = req.body
  const encryptedText = encrypt(text, password)
  res.send({ text: encryptedText })
})

router.post("/decrypt", (req: Request, res: Response) => {
  try {
    const { text, password } = req.body
    const result = decrypt(text, password)
    res.send({ text: result })
  } catch (error) {
    res.send({ text: error })
  }
})

export default router
