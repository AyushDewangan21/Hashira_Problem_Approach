// index.js
const fs = require("fs");
const { parseValue, lagrangeInterpolation } = require("./utils");

const data = JSON.parse(fs.readFileSync("./testcase2.json", "utf8"));

const k = data.keys.k;
const n = data.keys.n;

let roots = [];

for (let key in data) {
  if (key === "keys") continue;
  const entry = data[key];
  const index = parseInt(key);
  const value = parseValue(entry.value, entry.base);
  roots.push([index, value]);
}

roots.sort((a, b) => a[0] - b[0]);

const selected = roots.slice(0, k);

const coefficients = lagrangeInterpolation(selected);

console.log("Polynomial coefficients (lowest degree to highest):");
coefficients.forEach((c, i) => {
  console.log(`x^${i}: ${c}`);
});

// Validation
function evaluatePolynomial(coeffs, x) {
  let result = 0n;
  let xi = 1n;
  for (let coef of coeffs) {
    result += coef * xi;
    xi *= BigInt(x);
  }
  return result;
}

let allValid = true;

for (let [x, y] of roots) {
  let expected = evaluatePolynomial(coefficients, x);
  if (expected !== y) {
    console.log(
      `❌ Corrupted root detected at x=${x}. Expected: ${y}, Got: ${expected}`
    );
    allValid = false;
  }
}

if (allValid) {
  console.log("✅ All roots are valid. Task can be performed.");
} else {
  console.log("⚠️ Task aborted due to invalid/corrupted roots.");
}
