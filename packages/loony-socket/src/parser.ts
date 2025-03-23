import internal from "stream"

export function connection(socket: internal.Duplex) {
  socket.on("data", async (data) => {
    if (data.length < 2) return // Ignore invalid frames

    const opcode = data[0] & 0x0f // Extract opcode
    const isMasked = (data[1] & 0x80) !== 0 // Check if masked (client messages must be masked)
    let payloadLength = data[1] & 0x7f // Extract payload length

    let offset = 2 // Start of payload or mask key
    if (payloadLength === 126) {
      payloadLength = data.readUInt16BE(2)
      offset = 4
    } else if (payloadLength === 127) {
      payloadLength = data.readBigUInt64BE(2)
      offset = 10
    }

    let payload = Buffer.alloc(0)
    if (isMasked) {
      const maskKey = data.slice(offset, offset + 4)
      offset += 4

      payload = data.slice(offset, offset + payloadLength)
      for (let i = 0; i < payload.length; i++) {
        payload[i] ^= maskKey[i % 4] // Unmasking process
      }
    } else {
      payload = data.slice(offset, offset + payloadLength)
    }
    switch (opcode) {
      case 0x1: // Text Frame
        break

      case 0x2: // Binary Frame
        break

      case 0x8: // Close Frame
        socket.destroy()
        break

      case 0x9: // Ping Frame
        console.log("Received Ping, sending Pong")
        break

      case 0xa: // Pong Frame
        console.log("Received Pong")
        break

      default:
        console.log("Unknown Opcode:", opcode)
    }
  })
}

function parseWebSocketFrame(buffer: Buffer) {
  let offset: number = 0

  // Read first byte
  const firstByte = buffer[offset++]
  const FIN: boolean = (firstByte & 0b10000000) !== 0
  const RSV1: boolean = (firstByte & 0b01000000) !== 0
  const RSV2: boolean = (firstByte & 0b00100000) !== 0
  const RSV3: boolean = (firstByte & 0b00010000) !== 0
  const opcode: number = firstByte & 0b00001111

  // Read second byte
  const secondByte: number = buffer[offset++]
  const MASK: boolean = (secondByte & 0b10000000) !== 0
  let payloadLength: number = secondByte & 0b01111111

  // Extended payload length
  if (payloadLength === 126) {
    payloadLength = buffer.readUInt16BE(offset)
    offset += 2
  } else if (payloadLength === 127) {
    payloadLength = Number(buffer.readBigUInt64BE(offset))
    offset += 8
  }

  // Read masking key if present
  let maskingKey: Buffer<ArrayBuffer> | null = null
  if (MASK) {
    maskingKey = buffer.slice(offset, offset + 4)
    offset += 4
  }

  // Read payload
  const payloadData: Buffer<ArrayBuffer> = buffer.slice(
    offset,
    offset + payloadLength,
  )

  // Unmask if necessary
  if (MASK && maskingKey) {
    for (let i = 0; i < payloadData.length; i++) {
      payloadData[i] ^= maskingKey[i % 4]
    }
  }

  return {
    FIN,
    RSV1,
    RSV2,
    RSV3,
    opcode,
    MASK,
    payloadLength,
    maskingKey,
    payloadData,
  }
}

// Example Usage
const exampleFrame = Buffer.from([
  0x81, 0x85, 0x37, 0xfa, 0x21, 0x3d, 0x7f, 0x9f, 0x4d, 0x51, 0x58,
])

console.log(parseWebSocketFrame(exampleFrame))
