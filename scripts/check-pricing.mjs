import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  "shared/plan-access.js",
  "src/lib/plan-access.js",
  "mobile/src/lib/plan-access.js",
  "server/lib/billing.js",
  "src/pages/Pricing.jsx",
  "mobile/src/screens/tabs/UpgradeScreen.jsx",
  "mobile/src/data/appData.ts",
  "mobile/src/i18n/en.json",
  "mobile/src/i18n/es.json",
  "mobile/APP_STORE_LISTING.md",
];

const forbidden = [
  "$214.99",
  "$215.89",
  "$59.99",
  "$17.92",
  "Save 10%",
  "Ahorra 10%",
  "save_10",
];

const failures = [];
for (const file of files) {
  const content = readFileSync(resolve(root, file), "utf8");
  for (const value of forbidden) {
    if (content.includes(value)) failures.push(`${file}: stale value ${value}`);
  }
}

const required = [
  ["server/lib/billing.js", "[PLAN_IDS.PREMIUM_YEARLY]: 9999"],
  ["mobile/src/screens/tabs/UpgradeScreen.jsx", "useState('premium_monthly')"],
  ["mobile/src/screens/tabs/UpgradeScreen.jsx", "price: '$99.99'"],
  ["src/pages/Pricing.jsx", 'price: "$99.99"'],
  ["mobile/APP_STORE_LISTING.md", "RBTGenius: RBT Exam Prep"],
];

for (const [file, value] of required) {
  const content = readFileSync(resolve(root, file), "utf8");
  if (!content.includes(value)) failures.push(`${file}: missing ${value}`);
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log("Pricing and App Store naming are consistent.");
