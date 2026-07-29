import { mkdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  sharp = require(
    "/Users/enrique/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp",
  );
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const mobileDir = resolve(scriptDir, "..");
const assetRoot = join(mobileDir, "store-assets", "1.1.3", "en-US");

const collections = [
  {
    inputDir: join(assetRoot, "iphone-6.9"),
    outputDir: join(assetRoot, "iphone-6.9-marketing"),
    width: 1320,
    height: 2868,
    screenshot: { x: 130, y: 520, width: 1060, radius: 64 },
    labelY: 112,
    titleY: 232,
    titleSize: 78,
    lineHeight: 90,
    subtitleY: 448,
    subtitleSize: 31,
    items: [
      {
        file: "01-dashboard.png",
        title: ["Your RBT study plan,", "all in one place"],
        subtitle: "Practice, mock exams, flashcards and progress tracking",
      },
      {
        file: "02-practice.png",
        title: ["Master 1,125+", "practice questions"],
        subtitle: "Clear explanations across every exam domain",
      },
      {
        file: "03-analytics.png",
        title: ["Know exactly", "where to improve"],
        subtitle: "Track readiness, accuracy and domain performance",
      },
      {
        file: "04-mock-exam.png",
        title: ["Practice like", "it’s exam day"],
        subtitle: "Full 85-question timed mock exams",
      },
      {
        file: "05-flashcards.png",
        title: ["Review smarter", "with flashcards"],
        subtitle: "Build confidence one concept at a time",
      },
    ],
  },
  {
    inputDir: join(assetRoot, "ipad-13"),
    outputDir: join(assetRoot, "ipad-13-marketing"),
    width: 2064,
    height: 2752,
    screenshot: { x: 220, y: 550, width: 1624, radius: 58 },
    labelY: 118,
    titleY: 244,
    titleSize: 88,
    lineHeight: 102,
    subtitleY: 458,
    subtitleSize: 37,
    items: [
      {
        file: "01-practice.png",
        title: ["Practice across", "every RBT domain"],
        subtitle: "1,125+ questions with clear explanations",
      },
      {
        file: "02-analytics.png",
        title: ["See your progress", "at a glance"],
        subtitle: "Readiness, accuracy and domain-level insights",
      },
      {
        file: "03-mock-exam.png",
        title: ["Full-length", "mock exams"],
        subtitle: "85 questions in realistic exam conditions",
      },
      {
        file: "04-flashcards.png",
        title: ["Turn weak areas", "into strengths"],
        subtitle: "Focused flashcards for smarter review",
      },
    ],
  },
];

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function renderSvg(collection, item) {
  const inputPath = join(collection.inputDir, item.file);
  const imageData = readFileSync(inputPath).toString("base64");
  const { width, height, screenshot } = collection;
  const screenshotHeight = Math.round((screenshot.width * height) / width);
  const titleLines = item.title
    .map(
      (line, index) =>
        `<text x="${width / 2}" y="${collection.titleY + index * collection.lineHeight}" text-anchor="middle" class="title">${xml(line)}</text>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F3F7FF"/>
      <stop offset="58%" stop-color="#EAF1FF"/>
      <stop offset="100%" stop-color="#FFF8E7"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1E5EFF"/>
      <stop offset="100%" stop-color="#6B8CFF"/>
    </linearGradient>
    <clipPath id="screenClip">
      <rect x="${screenshot.x}" y="${screenshot.y}" width="${screenshot.width}" height="${screenshotHeight}" rx="${screenshot.radius}"/>
    </clipPath>
    <filter id="shadow" x="-30%" y="-20%" width="160%" height="160%">
      <feDropShadow dx="0" dy="28" stdDeviation="28" flood-color="#0F172A" flood-opacity="0.20"/>
    </filter>
    <style>
      .label { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", Arial, sans-serif; font-size: ${Math.round(collection.subtitleSize * 0.68)}px; font-weight: 800; letter-spacing: 8px; fill: #1E5EFF; }
      .title { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", Arial, sans-serif; font-size: ${collection.titleSize}px; font-weight: 850; letter-spacing: -2px; fill: #09142B; }
      .subtitle { font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", Arial, sans-serif; font-size: ${collection.subtitleSize}px; font-weight: 550; fill: #5A6C89; }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#background)"/>
  <circle cx="${Math.round(width * 0.9)}" cy="${Math.round(height * 0.08)}" r="${Math.round(width * 0.16)}" fill="#FFF0BE" opacity="0.62"/>
  <circle cx="${Math.round(width * 0.08)}" cy="${Math.round(height * 0.22)}" r="${Math.round(width * 0.13)}" fill="#C9D8FF" opacity="0.56"/>
  <rect x="${Math.round(width * 0.4)}" y="${collection.labelY - 31}" width="${Math.round(width * 0.2)}" height="7" rx="4" fill="url(#accent)"/>
  <text x="${width / 2}" y="${collection.labelY}" text-anchor="middle" class="label">RBTGENIUS · RBT EXAM PREP</text>
  ${titleLines}
  <text x="${width / 2}" y="${collection.subtitleY}" text-anchor="middle" class="subtitle">${xml(item.subtitle)}</text>
  <rect x="${screenshot.x}" y="${screenshot.y}" width="${screenshot.width}" height="${screenshotHeight}" rx="${screenshot.radius}" fill="#FFFFFF" filter="url(#shadow)"/>
  <image x="${screenshot.x}" y="${screenshot.y}" width="${screenshot.width}" height="${screenshotHeight}"
    preserveAspectRatio="xMidYMid meet" clip-path="url(#screenClip)"
    xlink:href="data:image/png;base64,${imageData}"/>
  <rect x="${screenshot.x}" y="${screenshot.y}" width="${screenshot.width}" height="${screenshotHeight}" rx="${screenshot.radius}" fill="none" stroke="#FFFFFF" stroke-opacity="0.8" stroke-width="5"/>
</svg>`;
}

for (const collection of collections) {
  mkdirSync(collection.outputDir, { recursive: true });
  for (const item of collection.items) {
    const outputPath = join(collection.outputDir, item.file);
    await sharp(Buffer.from(renderSvg(collection, item)))
      .png({ compressionLevel: 9, colours: 256 })
      .toColorspace("srgb")
      .toFile(outputPath);
    console.log(outputPath);
  }
}
