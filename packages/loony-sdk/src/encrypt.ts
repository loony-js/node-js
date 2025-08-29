import crypto from "node:crypto"
import argon2 from "argon2"

// Derive a 32-byte key from password + salt
// async function deriveKey(password: any, salt: any) {
//   // use argon2id, raw output
//   const key = await argon2.hash(password, {
//     type: argon2.argon2id,
//     salt,
//     raw: true,
//     hashLength: 32,
//     memoryCost: 2 ** 16, // tune parameters
//     timeCost: 3,
//     parallelism: 1,
//   })
//   return key // Buffer length 32
// }

export async function encrypt(plainText: string, password: string) {
  // 1) Generate random salt for Argon2
  const salt = crypto.randomBytes(16)

  // 2) Derive 32-byte key with Argon2id (match Rust defaults)
  const key = await argon2.hash(password, {
    type: argon2.argon2id,
    salt,
    hashLength: 32,
    raw: true, // return raw bytes instead of encoded string
    memoryCost: 19456, // KiB (same as Argon2::default in Rust)
    timeCost: 2, // iterations
    parallelism: 1,
  })

  // 3) AES-GCM (12-byte nonce)
  const nonce = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv("aes-256-gcm", key, nonce)

  // 4) Encrypt
  const ciphertext = Buffer.concat([cipher.update(plainText), cipher.final()])
  const tag = cipher.getAuthTag()
  const ctAndTag = Buffer.concat([ciphertext, tag])

  // 5) Output: salt || nonce || (ciphertext || tag)
  return Buffer.concat([salt, nonce, ctAndTag])
}

export async function decrypt(encryptedData: Buffer, password: string) {
  const buf = Buffer.from(encryptedData)

  // 1) Split salt, nonce, ciphertext+tag
  const salt = buf.subarray(0, 16)
  const nonce = buf.subarray(16, 28)
  const ciphertextAndTag = buf.subarray(28)

  // Last 16 bytes are the GCM auth tag
  const ciphertext = ciphertextAndTag.subarray(0, ciphertextAndTag.length - 16)
  const tag = ciphertextAndTag.subarray(ciphertextAndTag.length - 16)

  // 2) Derive same key with Argon2id (match Rust defaults)
  const key = await argon2.hash(password, {
    type: argon2.argon2id,
    salt,
    hashLength: 32,
    raw: true,
    memoryCost: 19456, // KiB
    timeCost: 2,
    parallelism: 1,
  })

  // 3) AES-256-GCM decrypt
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, nonce)
  decipher.setAuthTag(tag)

  const plainText = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ])

  return plainText
}
