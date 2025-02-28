# CLOAK (Protection Library)

- Password
- Videos/Images

### Usage

```js
import { ProcessHandler } from './node.js';
import { LoonyCl } from 'cloak';

(async () => {
  const node = new ProcessHandler();
  node.setArgs(process.argv);

  const Cl = new LoonyCl();
  Cl.setOptions(node.options);
  const res = Cl.run();
  console.log(res);
})();
```

### Encrypt

```bash
node ./index.js --method en --text 'Hello World!' --secretKey secretKey
```

### Decrypt

```bash
node ./index.js --method de --text '11eaf63eb8027ecc3dd8cace29bf9de9:2672640b5b785437627b3a4f8c17666c' --secretKey secretKey
```
