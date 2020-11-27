const tape = require('tape')
const sodium = require('sodium-native')
const RAXOR = require('./')

const KEY = Buffer.alloc(32).fill('testkey')
const NONCE = Buffer.alloc(24).fill('testnonce')

tape('basic', function (t) {
  const data = Buffer.from('helloworld')
  sodium.crypto_stream_xor(data, data, NONCE, KEY)

  const r = new RAXOR(NONCE, KEY)

  const data1 = Buffer.from('helloworld')
  r.update(data1, data1)

  t.same(data1, data)
  t.end()
})

tape('basic seek', function (t) {
  const data = Buffer.from('helloworld')
  sodium.crypto_stream_xor(data, data, NONCE, KEY)

  const r = new RAXOR(NONCE, KEY)

  const data1 = Buffer.from('world')
  r.seek(5)
  r.update(data1, data1)

  t.same(data1, data.slice(5))
  t.end()
})

tape('big seek', function (t) {
  const data = Buffer.alloc(1024 * 1024).fill('helloworld')
  const last = Buffer.from(data.slice(1024 * 1024 - 99))
  sodium.crypto_stream_xor(data, data, NONCE, KEY)

  const r = new RAXOR(NONCE, KEY)

  r.seek(1024 * 1024 - last.length)
  r.update(last, last)

  t.same(last, data.slice(1024 * 1024 - 99))
  t.end()
})
