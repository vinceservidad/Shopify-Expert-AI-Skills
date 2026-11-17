// Copies the CI summary written by scripts/ci.sh into the Worker bundle.
import { readFileSync, writeFileSync } from "node:fs";
const source = process.env.CI_REPORT ?? new URL("../../dist/ci-report.json", import.meta.url);
const report = JSON.parse(readFileSync(source, "utf8"));
writeFileSync(new URL("../src/report.js", import.meta.url),
  `export default ${JSON.stringify(report, null, 2)};\n`);
console.log(`Bundled CI report for ${report.commit} (passed: ${report.passed})`);
