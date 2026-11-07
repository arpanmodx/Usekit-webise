import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

// Pure JS PNG encoder for crisp geometric UseKit icons (192x192, 512x512, 180x180, maskable)
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcInput = Buffer.concat([typeBuf, data]);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generateIconPNG(size, isMaskable = false) {
  const rawData = Buffer.alloc(size * (size * 4 + 1));
  const pad = isMaskable ? Math.round(size * 0.16) : Math.round(size * 0.12);
  const gap = Math.round(size * 0.05);
  const cell = Math.floor((size - pad * 2 - gap) / 2);

  for (let y = 0; y < size; y++) {
    const rowStart = y * (size * 4 + 1);
    rawData[rowStart] = 0; // filter type 0

    for (let x = 0; x < size; x++) {
      const px = rowStart + 1 + x * 4;
      // Background: #0F172A (15, 23, 42)
      let r = 15, g = 23, b = 42, a = 255;

      const inTopRow = y >= pad && y < pad + cell;
      const inBottomRow = y >= pad + cell + gap && y < pad + cell * 2 + gap;
      const inLeftCol = x >= pad && x < pad + cell;
      const inRightCol = x >= pad + cell + gap && x < pad + cell * 2 + gap;

      if (inTopRow && inLeftCol) {
        // Top-left block: #2563EB (37, 99, 235)
        r = 37; g = 99; b = 235;
      } else if (inBottomRow && inRightCol) {
        // Bottom-right block: #3B82F6 (59, 130, 246)
        r = 59; g = 130; b = 246;
      } else if ((inTopRow && inRightCol) || (inBottomRow && inLeftCol)) {
        // Secondary blocks: #1E293B (30, 41, 59)
        r = 30; g = 41; b = 59;
      }

      rawData[px] = r;
      rawData[px + 1] = g;
      rawData[px + 2] = b;
      rawData[px + 3] = a;
    }
  }

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const compressed = zlib.deflateSync(rawData);
  return Buffer.concat([
    signature,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', compressed),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

const pubDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });

fs.writeFileSync(path.join(pubDir, 'pwa-192x192.png'), generateIconPNG(192, false));
fs.writeFileSync(path.join(pubDir, 'pwa-512x512.png'), generateIconPNG(512, false));
fs.writeFileSync(path.join(pubDir, 'pwa-maskable-512x512.png'), generateIconPNG(512, true));
fs.writeFileSync(path.join(pubDir, 'apple-touch-icon.png'), generateIconPNG(180, false));
console.log('Generated PWA PNG icons successfully.');
