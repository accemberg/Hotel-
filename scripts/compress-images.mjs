/**
 * compress-images.mjs
 *
 * Converts all JPEG/JPG/PNG images in /public/hotelpics/ to WebP format.
 * Max 200KB output. Originals are preserved alongside .webp versions.
 *
 * Usage:
 *   npm install sharp   (one-time, dev dependency)
 *   node scripts/compress-images.mjs
 *
 * After running, update any <img src="*.jpeg"> to <img src="*.webp">
 * or use the <picture> pattern for fallback (see bottom of this file).
 */

import { readdir, stat, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT_DIR  = path.join(__dirname, '..', 'public', 'hotelpics');
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'hotelpics'); // same dir, .webp suffix

const MAX_BYTES   = 200 * 1024; // 200 KB
const EXTENSIONS  = ['.jpg', '.jpeg', '.png'];

/** Convert a single image to WebP at best quality that fits under maxBytes */
async function toWebP(inputPath, outputPath) {
  // Start at quality 82, step down until size is under MAX_BYTES
  let quality = 82;
  let buffer;

  while (quality >= 40) {
    buffer = await sharp(inputPath)
      .webp({ quality, effort: 5 })
      .toBuffer();

    if (buffer.length <= MAX_BYTES) break;
    quality -= 6;
  }

  // If still over limit at q40, resize down proportionally
  if (buffer.length > MAX_BYTES) {
    const meta   = await sharp(inputPath).metadata();
    let  width   = meta.width;
    let  attempt = 0;

    while (buffer.length > MAX_BYTES && width > 400 && attempt < 8) {
      width   = Math.round(width * 0.85);
      buffer  = await sharp(inputPath).resize({ width }).webp({ quality: 72 }).toBuffer();
      attempt++;
    }
  }

  await sharp(buffer).toFile(outputPath);
  return buffer.length;
}

async function run() {
  if (!existsSync(INPUT_DIR)) {
    console.error(`❌  Input directory not found: ${INPUT_DIR}`);
    process.exit(1);
  }

  const files = await readdir(INPUT_DIR);
  const images = files.filter(f => EXTENSIONS.includes(path.extname(f).toLowerCase()));

  if (!images.length) {
    console.log('No images found in', INPUT_DIR);
    return;
  }

  console.log(`\n🖼  Found ${images.length} image(s) in /public/hotelpics/\n`);

  let saved = 0;
  for (const file of images) {
    const inputPath  = path.join(INPUT_DIR, file);
    const outputName = path.basename(file, path.extname(file)) + '.webp';
    const outputPath = path.join(OUTPUT_DIR, outputName);

    // Skip if webp already exists and is newer
    if (existsSync(outputPath)) {
      const inStat  = await stat(inputPath);
      const outStat = await stat(outputPath);
      if (outStat.mtimeMs >= inStat.mtimeMs) {
        console.log(`  ⏩  ${outputName} — already up to date, skipping`);
        continue;
      }
    }

    const origSize = (await stat(inputPath)).size;
    try {
      const outSize = await toWebP(inputPath, outputPath);
      const saving  = Math.round((1 - outSize / origSize) * 100);
      saved += (origSize - outSize);
      console.log(
        `  ✅  ${file} → ${outputName}  ` +
        `${(origSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB  ` +
        `(−${saving}%)`
      );
    } catch (err) {
      console.error(`  ❌  Failed: ${file} —`, err.message);
    }
  }

  console.log(`\n✨  Done. Total saved: ${(saved / 1024).toFixed(0)} KB\n`);
}

run();

/**
 * =============================================================================
 * HOW TO UPDATE YOUR <img> TAGS AFTER RUNNING THIS SCRIPT
 * =============================================================================
 *
 * Option A — Simple swap (96%+ browser support, safest for Next.js):
 *   <img src="/hotelpics/room.webp" ... />
 *
 * Option B — <picture> element with fallback (belt-and-suspenders):
 *   <picture>
 *     <source srcSet="/hotelpics/room.webp" type="image/webp" />
 *     <img src="/hotelpics/room.jpeg" alt="..." loading="lazy" />
 *   </picture>
 *
 * For Next.js App Router you can also use next/image for automatic WebP
 * conversion + srcset generation:
 *   import Image from 'next/image';
 *   <Image src="/hotelpics/room.jpeg" alt="..." fill sizes="..." />
 * =============================================================================
 */
