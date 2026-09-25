import fs from 'node:fs'
import path from 'node:path'

// Generates minimal but valid PNG files using raw byte manipulation.
// No dependencies required.

function crc32table() {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
}
const CRC_TABLE = crc32table()

function crc32(buf) {
  let crc = 0xffffffff
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function pngChunk(type, data) {
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length)
  const typeBuf = Buffer.from(type)
  const crcBuf  = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])))
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf])
}

function deflateStored(raw) {
  const blocks = []
  let pos = 0
  while (pos < raw.length) {
    const size = Math.min(65535, raw.length - pos)
    const last  = pos + size >= raw.length ? 1 : 0
    const header = Buffer.alloc(5)
    header[0] = last
    header.writeUInt16LE(size,  1)
    header.writeUInt16LE(~size & 0xffff, 3)
    blocks.push(header, raw.slice(pos, pos + size))
    pos += size
  }
  let s1 = 1, s2 = 0
  for (const b of raw) { s1 = (s1 + b) % 65521; s2 = (s2 + s1) % 65521 }
  const adler = Buffer.alloc(4)
  adler.writeUInt32BE(((s2 & 0xffff) * 65536 + (s1 & 0xffff)) >>> 0)
  return Buffer.concat([Buffer.from([0x78, 0x01]), ...blocks, adler])
}

function solidPNG(size, r, g, b) {
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8; ihdr[9] = 2 // 8-bit RGB

  const raw = Buffer.alloc(size * (1 + size * 3))
  for (let y = 0; y < size; y++) {
    const row = y * (1 + size * 3)
    raw[row] = 0 // filter none
    for (let x = 0; x < size; x++) {
      raw[row + 1 + x * 3]     = r
      raw[row + 1 + x * 3 + 1] = g
      raw[row + 1 + x * 3 + 2] = b
    }
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    sig,
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateStored(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ])
}

fs.mkdirSync('public/icons', { recursive: true })

// Blue Train cobalt blue: #0F1E3A = rgb(15, 30, 58)
fs.writeFileSync('public/icons/icon-192.png',        solidPNG(192, 15, 30, 58))
fs.writeFileSync('public/icons/icon-512.png',        solidPNG(512, 15, 30, 58))
fs.writeFileSync('public/icons/apple-touch-icon.png',solidPNG(180, 15, 30, 58))

// SVG icon (used for <link rel="icon"> in browsers that support it)
const svg = [
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">',
  '  <rect width="512" height="512" fill="#0F1E3A"/>',
  '  <rect x="0" y="0" width="512" height="4" fill="#C9A84C" opacity="0.7"/>',
  '  <rect x="0" y="508" width="512" height="4" fill="#C9A84C" opacity="0.7"/>',
  '  <rect x="186" y="186" width="140" height="140" fill="none" stroke="#C9A84C"',
  '        stroke-width="4" transform="rotate(45 256 256)"/>',
  '  <rect x="210" y="210" width="92" height="92" fill="#C9A84C" opacity="0.12"',
  '        transform="rotate(45 256 256)"/>',
  '  <text x="256" y="308" font-family="Georgia,serif" font-size="180" font-weight="400"',
  '        fill="#F0E8D0" text-anchor="middle" font-style="italic">E</text>',
  '  <text x="256" y="430" font-family="Georgia,serif" font-size="26"',
  '        fill="#C9A84C" text-anchor="middle" letter-spacing="6" opacity="0.8">THE ENCHANTED LINE</text>',
  '</svg>',
].join('\n')

fs.writeFileSync('public/icons/icon.svg', svg)

console.log('Icons generated:')
console.log('  public/icons/icon-192.png        (192×192 PNG)')
console.log('  public/icons/icon-512.png        (512×512 PNG)')
console.log('  public/icons/apple-touch-icon.png (180×180 PNG)')
console.log('  public/icons/icon.svg             (scalable SVG)')
