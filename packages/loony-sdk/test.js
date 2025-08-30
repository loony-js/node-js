/* eslint-disable no-undef */
const { encrypt, decrypt } = require("./dist/index")

;(async () => {
  const encRes = await encrypt("Sankar", "123456")
  console.log(encRes)
  const decRes = await decrypt(
    Buffer.from(encRes.toString("base64"), "base64"),
    "123456",
  )
  console.log(decRes)
})()
