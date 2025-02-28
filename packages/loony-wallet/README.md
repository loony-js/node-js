### Usage

```js
// Generate keypair from pnemonic
import { LoonyWallet } from 'loony-wallet';
import { ProcessHandler } from './node.js';

(async () => {
  const node = new ProcessHandler();
  node.setArgs(process.argv);

  const wallet = new LoonyWallet();
  wallet.setOptions(node.options);

  wallet.generateKeypairFromMnemonic('sankar');
})();
```

```bash
node ./index.js <name>
```
