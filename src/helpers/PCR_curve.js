// Inverse standard normal CDF (probit) approximation for z-score calculation
function getZScore(confidenceLevel) {
	const alpha = 1 - confidenceLevel;
	const p = 1 - alpha / 2;
	const t = Math.sqrt(-2 * Math.log(1 - p));
	// Abramowitz and Stegun approximation
	const c0 = 2.515517, c1 = 0.802853, c2 = 0.010328;
	const d1 = 1.432788, d2 = 0.189269, d3 = 0.001308;
	return t - ((c2 * t + c1) * t + c0) / (((d3 * t + d2) * t + d1) * t + 1);
}

/**
 * Calculates the limit as a percentage (0 to 100)
 *
 */
function calculateLimitPercentage(p0Decimal, n, z) {
	const limitDecimal = p0Decimal + z * Math.sqrt((p0Decimal * (1 - p0Decimal)) / n);
	return limitDecimal * 100;
}

/**
 * Generates separate x and y arrays for plotting
 * @param {number} p0Percent - Baseline proportion as a percentage (e.g., 5 for 5%)
 * @param {number} minN - Starting sample size (default: 1)
 * @param {number} maxN - Ending sample size (default: 1000)
 * @param {number} step - Step size for n (default: 1)
 * @param {number} confidenceLevel - Confidence level (default: 0.95 -> z ≈ 1.96)
 * @returns {{x: number[], y: number[]}} Object containing separate x and y arrays
 */
export function generateXYforPCRCurve (
	p0Percent,
	minN = 1,
	maxN = 1000,
	step = 1,
	confidenceLevel = 0.95
) {
	const z = getZScore(confidenceLevel);
	const p0Decimal = p0Percent / 100;

	const x = [];
	const y = [];

	for (let n = minN; n <= maxN; n += step) {
		x.push(n);
		y.push(calculateLimitPercentage(p0Decimal, n, z));
	}

	return { x, y };
}