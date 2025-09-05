// utils.js
function parseValue(value, base) {
  return BigInt(parseInt(value, parseInt(base)));
}

function lagrangeInterpolation(points) {
  const k = points.length;
  const coeffs = Array(k).fill(0n);

  for (let i = 0; i < k; i++) {
    let xi = BigInt(points[i][0]);
    let yi = BigInt(points[i][1]);

    let numerator = [1n];
    let denominator = 1n;

    for (let j = 0; j < k; j++) {
      if (j !== i) {
        let xj = BigInt(points[j][0]);

        // Multiply numerator by (x - xj)
        numerator = multiplyPoly(numerator, [-xj, 1n]);

        // Multiply denominator by (xi - xj)
        denominator *= xi - xj;
      }
    }

    // Scale numerator by yi / denominator
    const scaledNumerator = numerator.map((coef) => (coef * yi) / denominator);

    // Add to result coefficients
    for (let d = 0; d < scaledNumerator.length; d++) {
      coeffs[d] += scaledNumerator[d];
    }
  }

  return coeffs;
}

function multiplyPoly(p1, p2) {
  const result = Array(p1.length + p2.length - 1).fill(0n);

  for (let i = 0; i < p1.length; i++) {
    for (let j = 0; j < p2.length; j++) {
      result[i + j] += p1[i] * p2[j];
    }
  }

  return result;
}

module.exports = {
  parseValue,
  lagrangeInterpolation,
};
