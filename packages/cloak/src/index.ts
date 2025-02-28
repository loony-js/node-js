import crypto from "node:crypto"
import { Buffer } from "node:buffer"

// Constants for encryption
const algorithm = "aes-256-cbc" // AES encryption algorithm
const _keyLength = 32 // 256 bits (32 bytes)
const ivLength = 16 // Initialization vector (16 bytes)

// Helper function to generate key and IV
function getKeyAndIV(password: string) {
  // Use a secure hash algorithm (SHA-256) to create a 32-byte key from the password
  const key = crypto.createHash("sha256").update(password).digest()

  // Generate a random IV
  const iv = crypto.randomBytes(ivLength)

  return { key, iv }
}

// Encryption function
export const encrypt = (text: string, password: string) => {
  const { key, iv } = getKeyAndIV(password)

  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")

  return `${iv.toString("hex")}:${encrypted}`
}

// Decryption function
export const decrypt = (encryptedText: string, password: string) => {
  const [ivHex, encrypted] = encryptedText.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const key = crypto.createHash("sha256").update(password).digest()

  const decipher = crypto.createDecipheriv(algorithm, key, iv)
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")

  return decrypted
}

encrypt("sankar", "sankar")
