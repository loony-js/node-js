class HuffmanNode {
  char: string | null
  freq: number
  left: HuffmanNode | null
  right: HuffmanNode | null

  constructor(
    char: string | null,
    freq: number,
    left: HuffmanNode | null = null,
    right: HuffmanNode | null = null,
  ) {
    this.char = char
    this.freq = freq
    this.left = left
    this.right = right
  }
}

// Function to build the Huffman Tree
function buildHuffmanTree(text: string): HuffmanNode | null {
  if (!text) return null

  // Step 1: Count frequency of characters
  const freqMap: Map<string, number> = new Map()
  for (const char of text) {
    freqMap.set(char, (freqMap.get(char) || 0) + 1)
  }

  // Step 2: Create priority queue (Min Heap)
  const pq: HuffmanNode[] = [...freqMap.entries()].map(
    ([char, freq]) => new HuffmanNode(char, freq),
  )
  pq.sort((a, b) => a.freq - b.freq)

  // Step 3: Build Huffman Tree
  while (pq.length > 1) {
    const left = pq.shift()!
    const right = pq.shift()!
    const parent = new HuffmanNode(null, left.freq + right.freq, left, right)
    pq.push(parent)
    pq.sort((a, b) => a.freq - b.freq)
  }

  return pq[0] // Root of Huffman Tree
}

// Function to generate Huffman codes
function generateHuffmanCodes(
  root: HuffmanNode | null,
  prefix = "",
  codeMap: Record<string, string> = {},
): Record<string, string> {
  if (!root) return codeMap
  if (root.char !== null) {
    codeMap[root.char] = prefix
  }
  generateHuffmanCodes(root.left, prefix + "0", codeMap)
  generateHuffmanCodes(root.right, prefix + "1", codeMap)
  return codeMap
}

// Function to encode text
function encode(text: string, codeMap: Record<string, string>): string {
  return text
    .split("")
    .map((char) => codeMap[char])
    .join("")
}

// Function to decode text
function decode(encodedText: string, root: HuffmanNode | null): string {
  if (!root) return ""

  let decodedText = ""
  let node: HuffmanNode | null = root

  for (const bit of encodedText) {
    if (node) {
      node = bit === "0" ? node.left : node.right
      if (node && node?.char !== null) {
        decodedText += node.char
        node = root
      }
    }
  }

  return decodedText
}

export const testHuffman = () => {
  // Example Usage
  const text = "ABRACADABRA"
  const huffmanTree = buildHuffmanTree(text)
  if (huffmanTree) {
    const huffmanCodes = generateHuffmanCodes(huffmanTree)
    const encodedText = encode(text, huffmanCodes)
    const decodedText = decode(encodedText, huffmanTree)

    console.log("Original Text: ", text)
    console.log("Huffman Codes: ", huffmanCodes)
    console.log("Encoded Text: ", encodedText)
    console.log("Decoded Text: ", decodedText)
  }
}
