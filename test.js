import { Buffer } from "node:buffer"

const binaryBuffer = Buffer.from(
  "82 8D 1F A2 3B 7D 57 C7 4C 49 58 1B 1A 38 2D 1F 56 3B",
  "hex",
)

const textBuffer = Buffer.from(
  "81 8D 37 FA 21 3D 5F 97 4C 51 4D DF 1A 1B 07 D6 0B 4D 0E",
  "hex",
)

function run(data) {
  if (data.length < 2) return // Ignore invalid frames

  const opcode = data[0] & 0x0f // Extract opcode
  const isMasked = (data[1] & 0x80) !== 0 // Check if masked (client messages must be masked)
  let payloadLength = data[1] & 0x7f // Extract payload length
  return {
    opcode,
    isMasked,
    payloadLength,
  }
}

console.log(run(textBuffer))
console.log(run(binaryBuffer))
