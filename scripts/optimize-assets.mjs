import { createHash } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import ffmpeg from "ffmpeg-static";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "public/assets/manifest.json");
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const publicFile = (url) => path.join(root, "public", url.replace(/^\//, ""));
const videoOnly = process.argv.includes("--video-only");
const metadata = videoOnly
  ? JSON.parse(await readFile(path.join(root, "src/lib/asset-metadata.json"), "utf8"))
  : {};
const sizes = {
  "synord-mark.png": { widths: [64, 128, 256], sizes: "64px" },
  "synord-logo.png": { widths: [320, 640, 960], sizes: "(max-width: 639px) 240px, 480px" },
  "samir-ahmad.png": { widths: [480, 768], sizes: "(max-width: 767px) calc(100vw - 48px), 40vw" },
  "dalarna-winter-desktop.jpg": { widths: [960, 1440, 1920], sizes: "100vw" },
  "dalarna-winter-mobile.png": { widths: [480, 768, 960], sizes: "100vw" },
  "dalarna-hero.jpg": { widths: [768, 1280, 1920], sizes: "100vw" },
};

async function describe(url) {
  const buffer = await readFile(publicFile(url));
  return {
    src: url,
    bytes: buffer.length,
    sha256: createHash("sha256").update(buffer).digest("hex"),
  };
}

async function optimizeImage(input, name, requestedWidths, sizesValue, quality = 80) {
  const source = await sharp(input).metadata();
  const maximum = Math.min(source.width, Math.max(...requestedWidths));
  const widths = [
    ...new Set([...requestedWidths.filter((width) => width < maximum), maximum]),
  ].sort((a, b) => a - b);
  const variants = [];
  for (const width of widths) {
    const url = `/assets/images/${name}-${width}.webp`;
    await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, effort: 6, alphaQuality: 100 })
      .toFile(publicFile(url));
    const info = await sharp(publicFile(url)).metadata();
    variants.push({ ...(await describe(url)), width: info.width, height: info.height });
  }
  const largest = variants.at(-1);
  return {
    src: largest.src,
    width: largest.width,
    height: largest.height,
    srcSet: variants.map((variant) => `${variant.src} ${variant.width}w`).join(", "),
    sizes: sizesValue,
    variants,
  };
}

function runFfmpeg(args, capture = false) {
  if (!ffmpeg) throw new Error("ffmpeg-static does not provide a binary for this operating system");
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", ...args], {
      windowsHide: true,
    });
    const chunks = [];
    let errors = "";
    child.stdout.on("data", (chunk) => {
      if (capture) chunks.push(chunk);
    });
    child.stderr.on("data", (chunk) => {
      errors += chunk.toString();
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolve(Buffer.concat(chunks))
        : reject(new Error(`ffmpeg exited ${code}: ${errors}`)),
    );
  });
}

await mkdir(path.join(root, "public/assets/images"), { recursive: true });
await mkdir(path.join(root, "public/assets/video"), { recursive: true });
for (const entry of manifest.assets) {
  if (videoOnly) continue;
  if (
    entry.status !== "available" ||
    !/^image\/(?:png|jpeg)$/.test(entry.type) ||
    entry.id === "favicon"
  )
    continue;
  const config = sizes[entry.id] || {
    widths: [480, 768, 1200],
    sizes: "(max-width: 767px) calc(100vw - 48px), (max-width: 1199px) 50vw, 560px",
  };
  const name = path.basename(entry.id).replace(/\.[^.]+$/, "");
  const image = await optimizeImage(
    publicFile(entry.localPath),
    name,
    config.widths,
    config.sizes,
    /logo|mark/.test(name) ? 88 : 80,
  );
  metadata[entry.id] = image;
  entry.optimized = image.variants;
  const bytes = image.variants.at(-1).bytes;
  console.log(
    `${entry.id}: ${entry.bytes} -> ${bytes} bytes (${Math.round((1 - bytes / entry.bytes) * 100)}% smaller at ${image.width}px)`,
  );
}

const heroEntry = manifest.assets.find(
  (entry) => entry.id === "dalanord-hero.webm" && entry.status === "available",
);
if (heroEntry) {
  const videoInput = publicFile(heroEntry.localPath);
  const sourceBytes = heroEntry.sourceBytes ?? heroEntry.declaredBytes;
  const sourceSha256 =
    heroEntry.sourceSha256 ?? "d61d5c34db2352e7b185e11720fbbdae2863eff8619692302eeed061a012ea5d";
  const frame = await runFfmpeg(
    [
      "-ss",
      "0.5",
      "-i",
      videoInput,
      "-frames:v",
      "1",
      "-f",
      "image2pipe",
      "-vcodec",
      "png",
      "pipe:1",
    ],
    true,
  );
  metadata.heroPoster = await optimizeImage(frame, "hero-poster", [960, 1440, 1920], "100vw", 78);
  metadata.heroMobile = await optimizeImage(frame, "hero-mobile", [480, 768], "100vw", 76);
  const videoUrl = "/assets/video/dalanord-hero.webm";
  const inputDescription = await describe(heroEntry.localPath);
  if (inputDescription.sha256 === sourceSha256) {
    const temporaryVideoUrl = "/assets/video/dalanord-hero.optimized.webm";
    console.log("Optimizing hero video…");
    await runFfmpeg([
      "-i",
      videoInput,
      "-t",
      "16",
      "-an",
      "-vf",
      "scale='min(960,iw)':-2,fps=20",
      "-c:v",
      "libvpx-vp9",
      "-crf",
      "44",
      "-b:v",
      "0",
      "-row-mt",
      "1",
      "-deadline",
      "good",
      "-cpu-used",
      "4",
      "-y",
      publicFile(temporaryVideoUrl),
    ]);
    await rename(publicFile(temporaryVideoUrl), publicFile(videoUrl));
  } else {
    console.log("Hero video is already optimized; keeping the single runtime file.");
  }
  metadata.heroVideo = await describe(videoUrl);
  heroEntry.localPath = videoUrl;
  heroEntry.bytes = metadata.heroVideo.bytes;
  heroEntry.sha256 = metadata.heroVideo.sha256;
  heroEntry.sourceBytes = sourceBytes;
  heroEntry.sourceSha256 = sourceSha256;
  heroEntry.optimized = [...metadata.heroPoster.variants, ...metadata.heroMobile.variants];
  heroEntry.processing = {
    excerptSeconds: 16,
    maximumWidth: 960,
    fps: 20,
    codec: "VP9",
    crf: 44,
    singleFile: true,
    note: "Only the optimized runtime video is retained locally; source provenance remains in the inventory.",
  };
  console.log(
    `Hero video: ${sourceBytes} -> ${metadata.heroVideo.bytes} bytes (${Math.round((1 - metadata.heroVideo.bytes / sourceBytes) * 100)}% smaller)`,
  );
}

// Sharing uses the existing photograph and logo, composed locally with no external requests.
const socialBackground = publicFile(metadata.heroPoster?.src || metadata["hero-forest.jpg"].src);
const logo = await sharp(publicFile("/assets/images/synord-mark-256.webp"))
  .resize({ width: 220, height: 220, fit: "inside" })
  .toBuffer();
await sharp(socialBackground)
  .resize(1200, 630, { fit: "cover" })
  .blur(2)
  .composite([
    {
      input: Buffer.from(
        '<svg width="1200" height="630"><rect width="1200" height="630" fill="#f5f1e9" opacity="0.78"/></svg>',
      ),
    },
    { input: logo, gravity: "centre" },
  ])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(publicFile("/assets/social-share.jpg"));
metadata.socialShare = {
  ...(await describe("/assets/social-share.jpg")),
  width: 1200,
  height: 630,
};
manifest.socialShare = metadata.socialShare;
const logoSourceEntry = manifest.assets.find((entry) => entry.id === "synord-mark.png");
if (logoSourceEntry?.status === "available") {
  logoSourceEntry.sourceBytes = logoSourceEntry.bytes;
  logoSourceEntry.sourceSha256 = logoSourceEntry.sha256;
  logoSourceEntry.status = "source-remote";
  logoSourceEntry.usageNote =
    "The source is re-imported only for optimization; runtime uses the committed WebP variants.";
  await unlink(publicFile(logoSourceEntry.localPath)).catch((error) => {
    if (error?.code !== "ENOENT") throw error;
  });
}
manifest.optimizedAt = new Date().toISOString();
manifest.totals = {
  originalBytes: manifest.assets.reduce((sum, entry) => sum + (entry.bytes || 0), 0),
  optimizedBytes:
    manifest.assets.reduce(
      (sum, entry) => sum + (entry.optimized?.reduce((total, item) => total + item.bytes, 0) || 0),
      0,
    ) + metadata.socialShare.bytes,
};
await writeFile(
  path.join(root, "src/lib/asset-metadata.json"),
  `${JSON.stringify(metadata, null, 2)}\n`,
);
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(
  "Optimized local assets and src/lib/asset-metadata.json generated. No network required.",
);
