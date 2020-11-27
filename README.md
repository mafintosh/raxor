# RAXOR

A seekable (random-access) XSALSA20 xor stream.

```
npm install raxor
```

## Usage

``` js
const RAXOR = require('raxor')

// nonce and key should be buffers of the ... nonce and key
const r = new RAXOR(nonce, key)

r.seek(10000) // seek to byte offset 10k
r.update(out, input) // xor the input buffer as if it was as this offset

r.final() // destroy the instance
```

## License

MIT
