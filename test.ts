import { Buffer } from "node:buffer"

function decodeWebSocketMessage(buffer: Buffer) {
  const secondByte = buffer[1]
  const length = secondByte & 127
  const maskStart = 2
  const dataStart = maskStart + 4
  const mask = buffer.subarray(maskStart, maskStart + 4)
  const data = buffer.subarray(dataStart, dataStart + length)
  let result = ""

  for (let i = 0; i < length; i++) {
    result += String.fromCharCode(data[i] ^ mask[i % 4]) // Apply unmasking
  }
  return result
}

const hexArray = [
  0x81, 0x95, 0x0a, 0x94, 0x09, 0x71, 0x59, 0xc0, 0x48, 0x23, 0x5e, 0xcb, 0x5f,
  0x3e, 0x43, 0xd7, 0x4c, 0x2e, 0x58, 0xd1, 0x4a, 0x3e, 0x58, 0xd0, 0x40, 0x3f,
  0x4d,
]

const buffer = Buffer.from(hexArray)
console.log(decodeWebSocketMessage(buffer))
