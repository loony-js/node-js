export function generateHexBinaryTable() {
  console.log("| Hex  | Binary       |")
  console.log("|------|-------------|")

  for (let i = 0; i <= 0x88; i++) {
    const hex = i.toString(16).toUpperCase().padStart(2, "0") // Convert to hex and uppercase
    const binary = i.toString(2).padStart(8, "0") // Convert to binary (8-bit format)
    console.log(`| 0x${hex} | ${binary} |`)
  }
}
