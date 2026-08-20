import fs from 'fs';
import path from 'path';

// Generate a valid 32x32 uncompressed BMP icon into an ICO file
const width = 32;
const height = 32;

// ICO Header (6 bytes): Reserved (2), Type (2 = 1 for ICO), Count (2 = 1 image)
const icoHeader = Buffer.from([0, 0, 1, 0, 1, 0]);

// BITMAPINFOHEADER (40 bytes)
const biSize = 40;
const biWidth = width;
const biHeight = height * 2; // ICO BMP format specifies height * 2 (XOR mask + AND mask)
const biPlanes = 1;
const biBitCount = 32;
const biCompression = 0; // BI_RGB
const biSizeImage = width * height * 4;

const bmpHeader = Buffer.alloc(40);
bmpHeader.writeUInt32LE(biSize, 0);
bmpHeader.writeInt32LE(biWidth, 4);
bmpHeader.writeInt32LE(biHeight, 8);
bmpHeader.writeUInt16LE(biPlanes, 12);
bmpHeader.writeUInt16LE(biBitCount, 14);
bmpHeader.writeUInt32LE(biCompression, 16);
bmpHeader.writeUInt32LE(biSizeImage, 20);

// Pixel Data (32x32 BGRA from bottom to top)
const pixels = Buffer.alloc(width * height * 4);

// Helper to draw a pixel
function setPixel(x, y, r, g, b, a) {
  if (x < 0 || x >= width || y < 0 || y >= height) return;
  const py = height - 1 - y; // BMP is bottom-to-top
  const idx = (py * width + x) * 4;
  pixels[idx + 0] = b;
  pixels[idx + 1] = g;
  pixels[idx + 2] = r;
  pixels[idx + 3] = a;
}

// Background rounded square (#18181b = dark zinc)
for (let y = 0; y < 32; y++) {
  for (let x = 0; x < 32; x++) {
    // Rounded corners
    const isCorner = 
      (x < 4 && y < 4 && (x-4)*(x-4) + (y-4)*(y-4) > 16) ||
      (x > 27 && y < 4 && (x-27)*(x-27) + (y-4)*(y-4) > 16) ||
      (x < 4 && y > 27 && (x-4)*(x-4) + (y-27)*(y-27) > 16) ||
      (x > 27 && y > 27 && (x-27)*(x-27) + (y-27)*(y-27) > 16);
    if (!isCorner) {
      setPixel(x, y, 24, 24, 27, 255);
    }
  }
}

// Draw Coffee Cup (#f59e0b = amber-500)
for (let y = 13; y <= 24; y++) {
  for (let x = 7; x <= 20; x++) {
    // Cup rounding at bottom
    if (y > 19) {
      const bottomDist = y - 19;
      if (x < 7 + bottomDist || x > 20 - bottomDist) continue;
    }
    setPixel(x, y, 245, 158, 11, 255);
  }
}

// Cup Handle
for (let y = 14; y <= 20; y++) {
  for (let x = 20; x <= 24; x++) {
    if ((x === 23 || x === 24 || y === 14 || y === 20) && !(x === 21 && y > 15 && y < 19)) {
      setPixel(x, y, 245, 158, 11, 255);
    }
  }
}

// Steam Lines (#fbbf24 = amber-400)
const steam = [
  [10, 6], [11, 7], [10, 8], [11, 9],
  [14, 5], [15, 6], [14, 7], [15, 8],
  [18, 6], [17, 7], [18, 8], [17, 9]
];
for (const [sx, sy] of steam) {
  setPixel(sx, sy, 251, 191, 36, 255);
  setPixel(sx+1, sy, 251, 191, 36, 180);
}

// Moon (#fef3c7 = light warm gold)
const moon = [
  [25, 3], [24, 3], [25, 4], [24, 4], [23, 4],
  [25, 5], [24, 5], [23, 5], [22, 5],
  [24, 6], [23, 6], [22, 6]
];
for (const [mx, my] of moon) {
  setPixel(mx, my, 254, 243, 199, 255);
}

// AND mask (1 bit per pixel, 32x32 / 8 = 128 bytes of 0s for full transparency control)
const andMask = Buffer.alloc((width * height) / 8, 0);

const imgData = Buffer.concat([bmpHeader, pixels, andMask]);

// ICO Directory Entry (16 bytes)
const icoEntry = Buffer.alloc(16);
icoEntry.writeUInt8(width, 0); // width
icoEntry.writeUInt8(height, 1); // height
icoEntry.writeUInt8(0, 2); // color count
icoEntry.writeUInt8(0, 3); // reserved
icoEntry.writeUInt16LE(1, 4); // color planes
icoEntry.writeUInt16LE(32, 6); // bpp
icoEntry.writeUInt32LE(imgData.length, 8); // image size
icoEntry.writeUInt32LE(6 + 16, 12); // image offset

const icoFile = Buffer.concat([icoHeader, icoEntry, imgData]);
const outPath = path.resolve('public/favicon.ico');
fs.writeFileSync(outPath, icoFile);
console.log('✅ Generated custom favicon.ico at:', outPath);
