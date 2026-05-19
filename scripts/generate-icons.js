// Run this script once to generate PWA icons: node scripts/generate-icons.js
// Requires: npm install canvas

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generateIcon(size, outputPath) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // Background - navy blue
  ctx.fillStyle = '#070235';
  ctx.fillRect(0, 0, size, size);

  // Accent circle - teal
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size * 0.35;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fillStyle = '#006b5f';
  ctx.fill();

  // Letter "R" - white
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${size * 0.4}px Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('R', centerX, centerY + size * 0.02);

  // Save
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Generated: ${outputPath}`);
}

// Generate icons
const iconsDir = path.join(__dirname, '..', 'public', 'icons');

generateIcon(192, path.join(iconsDir, 'icon-192.png'));
generateIcon(512, path.join(iconsDir, 'icon-512.png'));

// Generate favicon (32x32)
generateIcon(32, path.join(__dirname, '..', 'public', 'favicon.ico'));

// Generate apple-touch-icon (180x180)
generateIcon(180, path.join(__dirname, '..', 'public', 'apple-touch-icon.png'));

console.log('All icons generated!');
