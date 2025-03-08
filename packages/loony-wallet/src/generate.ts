import bip39 from "bip39"
import { derivePath } from "ed25519-hd-key"
import nacl from "tweetnacl"
import { Keypair } from "@solana/web3.js"
import crypto from "node:crypto"
import { Buffer } from "node:buffer"

export const logCredentials = (
  mnemonic: string,
  solanaKeypair: Keypair,
  name: string,
) => {
  console.log(`Mnemonic Phrase (${name}):`, mnemonic)
  console.log(`Public Key (${name}):`, solanaKeypair.publicKey.toString())
  console.log(
    `Secret Key (${name}) (Bytes):`,
    solanaKeypair.secretKey.toString(),
  )
  // console.log(`Secret Key (${name}) (Bytes):`, solanaKeypair.secretKey.toString('hex'));
  console.log(
    `Secret Key (${name}) (Hex):`,
    Buffer.from(solanaKeypair.secretKey).toString("hex"),
  )
}

// export const generateKeypairFromCustomMnemonic = async (params) => {
//   // const mnemonic = bip39.generateMnemonic();
//   const mnemonic = configData.mnemonic;
//   const seed = bip39.mnemonicToSeedSync(mnemonic, configData.password); // (mnemonic, password)
//   const keypair = Keypair.fromSeed(seed.subarray(0, 32));

//   logCredentials(mnemonic, keypair);
// };

export const generateKeypairFromMnemonic = async (
  mnemonic: string,
  derivationPath = "m/44'/501'/0'/0'",
  name: string,
  password: string,
) => {
  try {
    // Validate and normalize the mnemonic
    if (!bip39.validateMnemonic(mnemonic)) {
      throw new Error("Invalid mnemonic phrase")
    }

    // Convert the mnemonic to a seed
    const seed = await bip39.mnemonicToSeedSync(mnemonic, password)

    // Derive the keypair using the seed and a derivation path
    const { key } = derivePath(derivationPath, seed.toString("hex"))

    // Generate the keypair using the derived key
    const keypair = nacl.sign.keyPair.fromSeed(key)

    // Create a Solana Keypair object
    const solanaKeypair = Keypair.fromSecretKey(Buffer.from(keypair.secretKey))

    logCredentials(mnemonic, solanaKeypair, name)
    return solanaKeypair
  } catch (error) {
    console.error("Error generating keypair from mnemonic:", error)
  }
}

export const createHash = (name: string) => {
  // Create a 256-bit seed from the custom string
  const seed = crypto.createHash("sha256").update(name).digest("hex")
  // Convert seed to mnemonic
  const mnemonic = bip39.entropyToMnemonic(seed)
  return mnemonic
}
