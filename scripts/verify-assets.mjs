import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Deliberately read-only and local-only: no fetch, downloads, subprocesses or writes.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = path.join(root, "public");
const errors = [];
const resources = new Map();
const verified = new Map();
let metadataReferences = 0;
let auditedSources = 0;

function fail(message) {
  errors.push(message);
}

function localFile(url) {
  if (
    typeof url !== "string" ||
    !url.startsWith("/") ||
    url.startsWith("//") ||
    url.includes("\\")
  ) {
    throw new Error(`Expected a same-origin absolute path, got ${JSON.stringify(url)}`);
  }
  const decoded = decodeURIComponent(url.split(/[?#]/, 1)[0]);
  const target = path.resolve(publicRoot, `.${decoded}`);
  const relative = path.relative(publicRoot, target);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Asset URL escapes public/: ${url}`);
  }
  return target;
}

function inferredType(url) {
  return {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".avif": "image/avif",
    ".svg": "image/svg+xml",
    ".webm": "video/webm",
    ".woff2": "font/woff2",
    ".css": "text/css",
    ".txt": "text/plain",
  }[path.extname(url).toLowerCase()];
}

function checkContent(buffer, type, url) {
  const text = buffer.subarray(0, 1024).toString("utf8").trimStart();
  if (/^<!doctype html|^<html|^<head|^<body/i.test(text)) {
    throw new Error(`HTML error/login page saved as ${url}`);
  }
  const valid = {
    "image/png": () => buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])),
    "image/jpeg": () => buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255,
    "image/webp": () =>
      buffer.subarray(0, 4).toString() === "RIFF" && buffer.subarray(8, 12).toString() === "WEBP",
    "image/avif": () =>
      buffer.subarray(4, 8).toString() === "ftyp" &&
      /avif|avis/.test(buffer.subarray(8, 32).toString()),
    "image/svg+xml": () =>
      /<svg[\s>]/i.test(buffer.toString("utf8")) &&
      !/<script[\s>]|\bon\w+\s*=|(?:href|src)\s*=\s*["']\s*(?:https?:|\/\/|javascript:)/i.test(
        buffer.toString("utf8"),
      ),
    "video/webm": () => buffer.subarray(0, 4).equals(Buffer.from([26, 69, 223, 163])),
    "font/woff2": () => buffer.subarray(0, 4).toString() === "wOF2",
    "text/css": () => /@font-face/.test(buffer.toString("utf8")),
    "text/plain": () => buffer.toString("utf8").includes("SIL OPEN FONT LICENSE"),
  };
  if (!valid[type])
    throw new Error(`Unsupported or missing asset type ${JSON.stringify(type)} for ${url}`);
  if (!valid[type]()) throw new Error(`Content/signature does not match ${type}: ${url}`);
}

function register(resource, label) {
  const url = resource.src || resource.localPath;
  try {
    localFile(url);
    if (!Number.isSafeInteger(resource.bytes) || resource.bytes <= 0)
      throw new Error("Missing positive byte count");
    if (!/^[a-f0-9]{64}$/.test(resource.sha256 || "")) throw new Error("Missing SHA-256");
    const previous = resources.get(url);
    if (previous && (previous.bytes !== resource.bytes || previous.sha256 !== resource.sha256)) {
      throw new Error("Conflicting inventory entries for the same URL");
    }
    resources.set(url, { ...resource, src: url, type: resource.type || inferredType(url) });
  } catch (error) {
    fail(`${label}: ${error.message}`);
  }
}

async function verify(url) {
  if (verified.has(url)) return verified.get(url);
  const resource = resources.get(url);
  if (!resource) throw new Error(`Local URL is not in the asset inventory: ${url}`);
  const buffer = await readFile(localFile(url));
  if (buffer.length !== resource.bytes)
    throw new Error(`Byte count changed: ${url} (${buffer.length}, expected ${resource.bytes})`);
  const hash = createHash("sha256").update(buffer).digest("hex");
  if (hash !== resource.sha256) throw new Error(`SHA-256 changed: ${url}`);
  checkContent(buffer, resource.type, url);
  verified.set(url, buffer);
  return buffer;
}

async function reference(url, label) {
  metadataReferences++;
  try {
    localFile(url);
    await verify(url);
  } catch (error) {
    fail(`${label}: ${error.message}`);
  }
}

async function checkMetadata(value, label) {
  if (!value || typeof value !== "object") return;
  if (typeof value.src === "string") {
    await reference(value.src, `${label}.src`);
    const entry = resources.get(value.src);
    for (const key of ["bytes", "sha256", "width", "height"]) {
      if (value[key] !== undefined && entry?.[key] !== undefined && value[key] !== entry[key]) {
        fail(`${label}.${key} disagrees with the manifest for ${value.src}`);
      }
    }
  }
  if (value.srcSet !== undefined) {
    if (typeof value.srcSet !== "string" || !value.srcSet.trim())
      fail(`${label}.srcSet must be nonempty`);
    else
      for (const candidate of value.srcSet.split(",")) {
        const match = /^(\S+)\s+(\d+)w$/.exec(candidate.trim());
        if (!match) {
          fail(`${label}: Invalid responsive image candidate ${JSON.stringify(candidate)}`);
          continue;
        }
        await reference(match[1], `${label}.srcSet`);
        const width = resources.get(match[1])?.width;
        if (width !== Number(match[2]))
          fail(`${label}: srcSet width does not match the manifest for ${match[1]}`);
      }
  }
  for (const [key, nested] of Object.entries(value)) {
    if (nested && typeof nested === "object") await checkMetadata(nested, `${label}.${key}`);
  }
}

async function checkCssUrls(text, label, requireFontFaces = false) {
  if (requireFontFaces && !/@font-face/.test(text))
    fail(`${label}: No self-hosted font faces found`);
  for (const match of text.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) {
    const url = match[1];
    if (url.startsWith("#") || url.startsWith("data:")) continue;
    await reference(url, `${label} url()`);
  }
  for (const match of text.matchAll(/@import\s+["']([^"']+)["']/g)) {
    if (match[1].startsWith("/")) await reference(match[1], `${label} @import`);
    else if (/^(?:https?:)?\/\//.test(match[1])) fail(`${label}: External CSS import ${match[1]}`);
  }
}

async function sourceFiles(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (["server", "__tests__"].includes(entry.name)) continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...(await sourceFiles(file)));
    else if (/\.(?:tsx?|css)$/.test(entry.name) && !/\.(?:test|spec|server)\./.test(entry.name))
      result.push(file);
  }
  return result;
}

try {
  const manifest = JSON.parse(
    await readFile(path.join(publicRoot, "assets/manifest.json"), "utf8"),
  );
  if (!Array.isArray(manifest.assets) || !manifest.assets.length)
    throw new Error("Manifest has no asset inventory");
  for (const entry of manifest.assets) {
    if (entry.status === "removed-unused") continue;
    if (entry.status === "source-remote") {
      for (const variant of entry.optimized || [])
        register(variant, `manifest.${entry.id}.optimized`);
      continue;
    }
    if (entry.status !== "available")
      fail(`Missing inventory resource ${entry.id}: ${entry.originalUrl} -> ${entry.localPath}`);
    register(entry, `manifest.${entry.id}`);
    for (const variant of entry.optimized || [])
      register(variant, `manifest.${entry.id}.optimized`);
  }
  register(manifest.socialShare || {}, "manifest.socialShare");
  for (const url of resources.keys()) {
    try {
      await verify(url);
    } catch (error) {
      fail(error.message);
    }
  }

  const metadata = JSON.parse(
    await readFile(path.join(root, "src/lib/asset-metadata.json"), "utf8"),
  );
  await checkMetadata(metadata, "asset-metadata.json");
  const fontCss = await readFile(localFile("/assets/fonts/fonts.css"), "utf8");
  await checkCssUrls(fontCss, "public/assets/fonts/fonts.css", true);

  for (const file of await sourceFiles(path.join(root, "src"))) {
    const relative = path.relative(root, file).replaceAll("\\", "/");
    const text = await readFile(file, "utf8");
    auditedSources++;
    const forbidden = [
      [
        /\bfrom\s*["'][^"']+\.asset\.json["']|\b(?:import|require)\s*(?:\(\s*)?["'][^"']+\.asset\.json["']/,
        "runtime import of an archived .asset.json pointer",
      ],
      [
        /__l5e\/assets-v1\/|@lovable\.dev\/|lovable-error-reporting|lovable-tagger/,
        "runtime Lovable asset endpoint/package/integration",
      ],
      [
        /\b(?:window|globalThis|self)\s*(?:\.\s*(?:__)?lovable\w*|\[\s*["'](?:__)?lovable\w*["']\s*\])|\b__lovable\w*/i,
        "Lovable global object",
      ],
      [/fonts\.(?:googleapis|gstatic)\.com/, "runtime Google Fonts request"],
    ];
    for (const [pattern, reason] of forbidden)
      if (pattern.test(text)) fail(`${relative}: ${reason}`);
    if (file.endsWith(".css")) await checkCssUrls(text, relative);
    for (const match of text.matchAll(/["'`]((?:\/assets\/|\/favicon\.)[^"'`\s]+)["'`]/g)) {
      if (!match[1].includes("${")) await reference(match[1], relative);
    }
  }
  console.log(
    `Verified ${manifest.assets.length} inventory resources, ${verified.size} unique local files and ${metadataReferences} metadata/CSS/source references.`,
  );
  console.log(
    `Audited ${auditedSources} client source files for runtime asset pointers, Lovable integration/globals and external font requests. Customer website links and archived provenance are allowed.`,
  );
} catch (error) {
  fail(error.message);
}

if (errors.length) {
  for (const message of [...new Set(errors)]) console.error(`FAIL ${message}`);
  console.error(`Asset verification failed (${errors.length} findings). No files were modified.`);
  process.exitCode = 1;
} else console.log("Asset verification passed. No network requests or file changes were made.");
