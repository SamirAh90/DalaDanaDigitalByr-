import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "public/assets");
const origins = [
  process.env.ASSET_SOURCE_ORIGIN || "https://daladana.lovable.app",
  "https://webarea-rediscovered.lovable.app",
];
const force = process.argv.includes("--force");
const sourceDir = path.join(root, "src/assets");
let previousManifest = {};
try {
  previousManifest = JSON.parse(await readFile(path.join(output, "manifest.json"), "utf8"));
} catch {
  // A first import has no inventory yet.
}
const runtimeUsage = {
  "case-juridik.png": ["src/content/site.ts", "src/routes/index.tsx", "src/routes/kundcase.tsx"],
  "case-kaffehuset.png": ["src/content/site.ts", "src/routes/index.tsx", "src/routes/kundcase.tsx"],
  "case-rozans.png": ["src/content/site.ts", "src/routes/index.tsx", "src/routes/kundcase.tsx"],
  "dalanord-hero.webm": [
    "src/components/site/HeroMedia.tsx (mobile, tablet and desktop video; poster fallback extracted from this source)",
  ],
  "dalarna-winter-desktop.jpg": ["src/routes/om-oss.tsx"],
  "dalarna-winter-mobile.png": ["src/routes/om-oss.tsx"],
  "samir-ahmad.png": ["src/routes/om-oss.tsx"],
  "synord-mark.png": [
    "src/components/site/Header.tsx",
    "src/components/site/Footer.tsx",
    "Local social-share composition",
  ],
};

async function walk(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(absolute)));
    else result.push(absolute);
  }
  return result;
}

function validate(buffer, type) {
  const first = buffer.subarray(0, 512).toString("utf8").trimStart();
  if (/^<!doctype html|^<html|^<head|^<body/i.test(first))
    throw new Error("HTML returned instead of the requested resource");
  const valid = {
    "image/png": () => buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/jpeg": () => buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255,
    "image/svg+xml": () =>
      /<svg[\s>]/i.test(buffer.toString("utf8")) &&
      !/<script[\s>]|\bon\w+\s*=|(?:href|src)\s*=\s*["']\s*(?:https?:|\/\/|javascript:)/i.test(
        buffer.toString("utf8"),
      ),
    "video/webm": () => buffer.subarray(0, 4).equals(Buffer.from([26, 69, 223, 163])),
    "font/woff2": () => buffer.subarray(0, 4).toString() === "wOF2",
    "text/plain": () => first.includes("SIL OPEN FONT LICENSE"),
  };
  if (!valid[type]?.()) throw new Error(`File signature or content did not match ${type}`);
}

async function retrieve(url, type) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(45000),
    headers: { "User-Agent": "Mozilla/5.0 DALADANA asset migration" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  validate(buffer, type);
  return buffer;
}

async function saveAsset(entry) {
  const target = path.join(root, "public", entry.localPath.replace(/^\//, ""));
  await mkdir(path.dirname(target), { recursive: true });
  let buffer;
  if (!force) {
    try {
      buffer = await readFile(target);
      validate(buffer, entry.type);
    } catch {
      buffer = undefined;
    }
  }
  const errors = [];
  if (!buffer) {
    for (const url of entry.requestedUrls) {
      try {
        buffer = await retrieve(url, entry.type);
        entry.downloadedFrom = url;
        break;
      } catch (error) {
        errors.push(`${url}: ${error.message}`);
      }
    }
    if (buffer) await writeFile(target, buffer);
  }
  if (buffer) {
    entry.status = "available";
    entry.bytes = buffer.length;
    entry.sha256 = createHash("sha256").update(buffer).digest("hex");
    console.log(`OK ${entry.localPath} (${entry.bytes} bytes)`);
  } else {
    entry.status = "missing";
    entry.errors = errors;
    console.error(`MISSING ${entry.localPath}: ${errors.join("; ")}`);
  }
  return entry;
}

await mkdir(output, { recursive: true });
const sources = await walk(path.join(root, "src"));
const textSources = await Promise.all(
  sources
    .filter((file) => /\.(?:tsx?|css)$/.test(file))
    .map(async (file) => [
      path.relative(root, file).replaceAll("\\", "/"),
      await readFile(file, "utf8"),
    ]),
);
const entries = [];
for (const file of (await walk(sourceDir)).filter((file) => file.endsWith(".asset.json")).sort()) {
  const data = JSON.parse(await readFile(file, "utf8"));
  const relative = path.relative(sourceDir, file).replaceAll("\\", "/");
  const fileName = relative.replace(/\.asset\.json$/, "");
  entries.push({
    id: fileName,
    sourceManifest: `src/assets/${relative}`,
    originalUrl: data.url,
    requestedUrls: data.url.startsWith("/")
      ? origins.map((origin) => new URL(data.url, origin).href)
      : [data.url],
    localPath:
      fileName === "dalanord-hero.webm"
        ? "/assets/video/dalanord-hero.webm"
        : `/assets/originals/${fileName}`,
    type: data.content_type,
    usage: [
      ...new Set([
        ...(runtimeUsage[fileName] || []),
        ...textSources.filter(([, text]) => text.includes(relative)).map(([file]) => file),
        ...(fileName.startsWith("technology/")
          ? ["src/lib/assets.ts (technology inventory; first ten displayed by TechnologyMarquee)"]
          : []),
      ]),
    ],
    usageNote:
      !runtimeUsage[fileName] && !fileName.startsWith("technology/")
        ? "Retained existing design asset; not currently rendered"
        : undefined,
    declaredBytes: data.size,
  });
}

// Keep provenance for intentionally removed, unused resources without restoring their files.
for (const previous of previousManifest.assets || []) {
  if (previous.status === "removed-unused" && !entries.some((entry) => entry.id === previous.id)) {
    entries.push(previous);
  }
}

// Import every font subset needed for the existing Swedish/Latin typography.
const fontQuery =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300..700&family=Cinzel:wght@600..700&display=swap";
let fontCss;
try {
  const response = await fetch(fontQuery, {
    signal: AbortSignal.timeout(45000),
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  fontCss = await response.text();
  const blocks = [...fontCss.matchAll(/\/\*\s*([^*]+)\s*\*\/\s*(@font-face\s*\{[^}]+\})/g)];
  const cssOutput = [];
  for (const [, subsetLabel, block] of blocks) {
    if (!["latin", "latin-ext"].includes(subsetLabel.trim())) continue;
    const family = /font-family:\s*'([^']+)'/.exec(block)?.[1];
    const url = /url\((https:[^)]+)\)/.exec(block)?.[1];
    if (!family || !url) continue;
    const name = `${family.toLowerCase().replaceAll(" ", "-")}-${subsetLabel.trim()}.woff2`;
    const localPath = `/assets/fonts/${name}`;
    if (!entries.some((entry) => entry.localPath === localPath))
      entries.push({
        id: name,
        originalUrl: url,
        requestedUrls: [url],
        localPath,
        type: "font/woff2",
        usage: ["src/styles.css"],
        family,
        subset: subsetLabel.trim(),
      });
    cssOutput.push(block.replace(url, localPath));
  }
  if (!cssOutput.length) throw new Error("Google Fonts returned no WOFF2 Latin subsets");
  await mkdir(path.join(output, "fonts"), { recursive: true });
  await writeFile(
    path.join(output, "fonts/fonts.css"),
    `/* Self-hosted fonts. SIL Open Font License files are in this directory. */\n${cssOutput.join("\n\n")}\n`,
  );
} catch (error) {
  console.error(`FONT CSS: ${error.message}`);
  const previousFonts =
    previousManifest.assets?.filter((entry) => entry.type === "font/woff2") || [];
  if (previousFonts.length) {
    for (const font of previousFonts) {
      const restored = { ...font };
      delete restored.status;
      entries.push(restored);
    }
    console.log("Keeping previously imported self-hosted font files and stylesheet.");
  } else {
    entries.push({
      id: "font-stylesheet",
      originalUrl: fontQuery,
      requestedUrls: [fontQuery],
      localPath: "/assets/fonts/fonts.css",
      type: "text/css",
      status: "missing",
      errors: [error.message],
      usage: ["src/styles.css"],
    });
  }
}
for (const [slug, name] of [
  ["ibmplexsans", "ibm-plex-sans"],
  ["cinzel", "cinzel"],
]) {
  const url = `https://raw.githubusercontent.com/google/fonts/main/ofl/${slug}/OFL.txt`;
  entries.push({
    id: `${name}-license`,
    originalUrl: url,
    requestedUrls: [url],
    localPath: `/assets/fonts/${name}-OFL.txt`,
    type: "text/plain",
    usage: ["Font redistribution license"],
  });
}

const pending = entries.filter((entry) => !entry.status);
// Small fixed concurrency is polite to the original hosting provider.
let cursor = 0;
await Promise.all(
  Array.from({ length: 4 }, async () => {
    while (cursor < pending.length) await saveAsset(pending[cursor++]);
  }),
);
const favicon = await readFile(path.join(root, "public/favicon.png"));
validate(favicon, "image/png");
entries.push({
  id: "favicon",
  originalUrl: null,
  requestedUrls: [],
  localPath: "/favicon.png",
  type: "image/png",
  bytes: favicon.length,
  status: "available",
  sha256: createHash("sha256").update(favicon).digest("hex"),
  usage: ["src/routes/__root.tsx"],
});
const manifest = {
  ...previousManifest,
  version: 1,
  importedAt: new Date().toISOString(),
  note: "Origins are provenance only. Production and build use committed local files; reimport is optional.",
  assets: entries,
};
for (const entry of entries) {
  const previous = previousManifest.assets?.find(
    (asset) => asset.id === entry.id && asset.sha256 === entry.sha256,
  );
  if (previous?.optimized) entry.optimized = previous.optimized;
  if (previous?.processing) entry.processing = previous.processing;
  if (previous?.downloadedFrom && !entry.downloadedFrom)
    entry.downloadedFrom = previous.downloadedFrom;
}
if (!entries.some((entry) => entry.id === "font-stylesheet")) {
  const css = await readFile(path.join(output, "fonts/fonts.css"));
  entries.push({
    id: "font-stylesheet",
    originalUrl: fontQuery,
    requestedUrls: [fontQuery],
    localPath: "/assets/fonts/fonts.css",
    type: "text/css",
    status: "available",
    bytes: css.length,
    sha256: createHash("sha256").update(css).digest("hex"),
    usage: ["src/styles.css"],
    note: "Generated stylesheet with exclusively same-origin local font URLs",
  });
}
await writeFile(path.join(output, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
const missing = entries.filter((entry) => entry.status === "missing");
console.log(
  `Imported/inventoried ${entries.length - missing.length}/${entries.length} assets. Manifest: public/assets/manifest.json`,
);
if (missing.length) process.exitCode = 1;
