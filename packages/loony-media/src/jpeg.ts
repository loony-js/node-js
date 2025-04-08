import fs from "fs"

// JPEG Markers
const MARKERS: Record<number, string> = {
  0xffd8: "Start of Image (SOI)",
  0xffe0: "Application Segment (APP0 - JFIF)",
  0xffdb: "Define Quantization Table (DQT)",
  0xffc0: "Start of Frame (SOF0 - Baseline DCT)",
  0xffc4: "Define Huffman Table (DHT)",
  0xffda: "Start of Scan (SOS)",
  0xffd9: "End of Image (EOI)",
}

// Read JPEG file
const jpegBuffer = fs.readFileSync("1x1.jpg")

// Convert buffer to hex
const hexBuffer = jpegBuffer.toString("hex")

// Scan for JPEG markers
let i = 0
while (i < hexBuffer.length) {
  const marker = hexBuffer.slice(i, i + 4) // Read 2 bytes (4 hex chars)
  const markerInt = parseInt(marker, 16)

  if (MARKERS[markerInt]) {
    console.log(
      `Found marker: 0x${marker.toUpperCase()} -> ${MARKERS[markerInt]}`,
    )
  }

  // Move to the next marker (JPEG segments have a length field after the marker)
  if (markerInt === 0xffd8 || markerInt === 0xffd9) {
    i += 4 // No length field for SOI and EOI
  } else {
    const length = parseInt(hexBuffer.slice(i + 4, i + 8), 16) // Read 2-byte length
    console.log(`  Segment length: ${length} bytes`)
    i += length * 2 + 4
  }
}
