import { encrypt, decrypt } from "cloak"
const enc = encrypt("TEXT_TO_ENCRYPT", "SECRET_KEY")

console.log(enc)

const dec = decrypt(enc, "SECRET_KEY")

console.log(dec)
