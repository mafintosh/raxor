const sodium = require('sodium-native')
const uint64le = require('uint64le')
const uint64be = require('uint64be')

const BLANK = Buffer.alloc(64)
const LE = new Uint8Array(new Uint16Array([0xff]).buffer)[0] === 0xff
const uint64 = LE ? uint64le : uint64be

module.exports = class RAXOR {
  constructor (nonce, key) {
    this.state = Buffer.alloc(sodium.crypto_stream_xor_STATEBYTES)
    sodium.crypto_stream_xor_init(this.state, nonce, key)
  }

  seek (offset) {
    const overflow = offset & 63
    uint64.encode(0, this.state, this.state.length - 16)
    uint64.encode((offset - overflow) / 64, this.state, this.state.length - 8)
    if (overflow) {
      const tmp = BLANK.slice(0, overflow)
      sodium.crypto_stream_xor_update(this.state, tmp, tmp)
      tmp.fill(0)
    }
  }

  update (out, data) {
    sodium.crypto_stream_xor_update(this.state, out, data)
  }

  final () {
    sodium.crypto_stream_xor_final(this.state)
  }
}
