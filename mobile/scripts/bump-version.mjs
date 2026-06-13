#!/usr/bin/env node
/**
 * bump-version.mjs — Sube la versión de marketing (CFBundleShortVersionString)
 * de la app iOS de forma consistente en los 3 lugares que importan:
 *
 *   1. app.json                              → expo.version
 *   2. ios/RBTGenius/Info.plist              → CFBundleShortVersionString
 *   3. ios/RBTGenius.xcodeproj/project.pbxproj → MARKETING_VERSION (x2)
 *
 * Por qué los 3: como existe la carpeta nativa ios/, EAS IGNORA app.json y usa
 * los valores nativos. Mantenerlos sincronizados evita que la versión salga
 * "pegada" (el bug de 1.1.0 vs 1.1.1).
 *
 * NO toca el build number (lo auto-incrementa EAS remoto), ni bundle id,
 * entitlements, credenciales, Apple Sign In, RevenueCat ni Google Sign-In.
 *
 * Uso:
 *   node scripts/bump-version.mjs patch   # 1.1.1 -> 1.1.2
 *   node scripts/bump-version.mjs minor   # 1.1.1 -> 1.2.0
 *   node scripts/bump-version.mjs major   # 1.1.1 -> 2.0.0
 *   node scripts/bump-version.mjs 1.4.0   # set explícito
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const MOBILE_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const FILES = {
  appJson: join(MOBILE_ROOT, 'app.json'),
  infoPlist: join(MOBILE_ROOT, 'ios', 'RBTGenius', 'Info.plist'),
  pbxproj: join(MOBILE_ROOT, 'ios', 'RBTGenius.xcodeproj', 'project.pbxproj'),
};

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

const SEMVER = /^(\d+)\.(\d+)\.(\d+)$/;

function readCurrentVersion() {
  const appJson = JSON.parse(readFileSync(FILES.appJson, 'utf8'));
  const version = appJson?.expo?.version;
  if (!version || !SEMVER.test(version)) {
    fail(`No pude leer una versión válida (x.y.z) en app.json (expo.version = ${version ?? 'undefined'})`);
  }
  return version;
}

function computeNext(current, arg) {
  if (SEMVER.test(arg)) return arg; // set explícito
  const [, maj, min, pat] = current.match(SEMVER).map(Number);
  switch (arg) {
    case 'major': return `${maj + 1}.0.0`;
    case 'minor': return `${maj}.${min + 1}.0`;
    case 'patch': return `${maj}.${min}.${pat + 1}`;
    default:
      fail(`Argumento inválido: "${arg}". Usa patch | minor | major | x.y.z`);
  }
}

function replaceOnce(content, regex, replacement, label) {
  const matches = content.match(regex);
  if (!matches) fail(`No encontré el patrón de versión en ${label}`);
  return content.replace(regex, replacement);
}

function bumpAppJson(next) {
  // Regex puntual para preservar el formato del archivo (app.json solo tiene un "version")
  const raw = readFileSync(FILES.appJson, 'utf8');
  const out = replaceOnce(raw, /"version":\s*"[^"]+"/, `"version": "${next}"`, 'app.json');
  writeFileSync(FILES.appJson, out);
}

function bumpInfoPlist(next) {
  const raw = readFileSync(FILES.infoPlist, 'utf8');
  const out = replaceOnce(
    raw,
    /(<key>CFBundleShortVersionString<\/key>\s*<string>)[^<]+(<\/string>)/,
    `$1${next}$2`,
    'Info.plist',
  );
  writeFileSync(FILES.infoPlist, out);
}

function bumpPbxproj(next) {
  const raw = readFileSync(FILES.pbxproj, 'utf8');
  if (!/MARKETING_VERSION\s*=\s*[^;]+;/.test(raw)) {
    fail('No encontré MARKETING_VERSION en project.pbxproj');
  }
  // Reemplaza TODAS las ocurrencias (Debug + Release)
  const out = raw.replace(/MARKETING_VERSION\s*=\s*[^;]+;/g, `MARKETING_VERSION = ${next};`);
  writeFileSync(FILES.pbxproj, out);
}

function verify(next) {
  const appJson = JSON.parse(readFileSync(FILES.appJson, 'utf8')).expo.version;
  const plist = readFileSync(FILES.infoPlist, 'utf8')
    .match(/<key>CFBundleShortVersionString<\/key>\s*<string>([^<]+)<\/string>/)?.[1];
  const pbxAll = [...readFileSync(FILES.pbxproj, 'utf8').matchAll(/MARKETING_VERSION\s*=\s*([^;]+);/g)]
    .map((m) => m[1].trim());

  const ok = appJson === next && plist === next && pbxAll.every((v) => v === next);
  console.log('\nVerificación:');
  console.log(`  app.json              → ${appJson}`);
  console.log(`  Info.plist            → ${plist}`);
  console.log(`  project.pbxproj (x${pbxAll.length}) → ${pbxAll.join(', ')}`);
  if (!ok) fail('Los archivos NO quedaron sincronizados. Revisa manualmente.');
}

// ── main ──────────────────────────────────────────────────────────────────────
const arg = process.argv[2];
if (!arg) fail('Falta argumento. Usa: patch | minor | major | x.y.z');

const current = readCurrentVersion();
const next = computeNext(current, arg);

if (next === current) {
  console.log(`\nLa versión ya es ${next}, no hay nada que cambiar.\n`);
  process.exit(0);
}

console.log(`\nSubiendo versión de marketing iOS:  ${current}  →  ${next}`);

bumpAppJson(next);
bumpInfoPlist(next);
bumpPbxproj(next);
verify(next);

console.log(`\n✓ Versión actualizada a ${next} en los 3 archivos.`);
console.log('  (El build number lo sube EAS solo en el próximo build — no se toca aquí.)');
console.log('\nSiguiente paso:');
console.log(`  git add app.json ios/ && git commit -m "chore(ios): bump versión a ${next}"`);
console.log('  eas build --platform ios --profile production\n');
