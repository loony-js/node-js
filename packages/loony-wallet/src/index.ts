import { createHash, generateKeypairFromMnemonic } from "./generate.js"

type Options = {
  [key: string]: string
}

class LoonyWallet {
  options: Options = {}

  setOptions(options: Options) {
    this.options = options
  }

  generateKeypairFromMnemonic() {
    const { name, password } = this.options
    const mnemonicName = createHash(name)
    generateKeypairFromMnemonic(
      mnemonicName,
      "m/44'/501'/0'/0'",
      name,
      password,
    )
  }
}

export { LoonyWallet }
