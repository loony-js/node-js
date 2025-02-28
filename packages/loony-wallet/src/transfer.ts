import {
  Connection,
  Keypair,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import bip39 from "bip39";

export const transfer = async () => {
  // const mnemonic = bip39.generateMnemonic();
  const fromMnemonic =
    "clip canvas thumb butter bus leopard abuse tool almost slow junk pink";
  console.log("fromMnemonic:", fromMnemonic);
  const fromSeed = bip39.mnemonicToSeedSync(fromMnemonic, "LovegoodSankar"); // (mnemonic, password)
  console.log("fromSeed: ", fromSeed);
  const fromKeypair = Keypair.fromSeed(fromSeed.subarray(0, 32));

  const toMnemonic =
    "olive load friend quantum vanish vivid tide where lizard curve tail cushion";
  console.log("toMnemonic:", toMnemonic);
  const toSeed = bip39.mnemonicToSeedSync(toMnemonic, "LovegoodSankar"); // (mnemonic, password)
  console.log("toSeed: ", toSeed);
  const toKeypair = Keypair.fromSeed(toSeed.subarray(0, 32));

  const connection = new Connection("http://localhost:8899", "confirmed");

  // const airdropSignature = await connection.requestAirdrop(fromKeypair.publicKey, LAMPORTS_PER_SOL);

  // await connection.confirmTransaction(airdropSignature);

  const lamportsToSend = 5_000_000_000;

  const transferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: lamportsToSend,
    }),
  );

  await sendAndConfirmTransaction(connection, transferTransaction, [
    fromKeypair,
  ]);
};
