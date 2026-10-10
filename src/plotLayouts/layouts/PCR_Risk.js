import { core } from "../core";
import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { yTrace } from "./parts/yTrace";
import { errorY } from "./parts/errorY";
import { dataLine } from "./parts/lines";
import * as colors from "../../colors";
import { customData } from "./customData";
import { getLegend } from "../../getLegend";

const build = {

	buildLayout( layoutData ){
		this.storeLayoutDataForRebuild(layoutData);

		const x1 = getAxis({
			type: 'x',
			numTicks: 20,
			title: layoutData.xaxis.title,
			range: [0,1000]
		});

		const y1 = getAxis({
			type: 'y',
			numTicks: 20,
			title: layoutData.yaxis.y1.title,
			range: [-2,50]
		});

		/** plotly layout **/
		this.layout = getLayout({
			// plotTitle: layoutData.plotHeader,
			xaxis: x1,
			yaxes: [ y1 ],
			colors: 'posNeg',
			legend: getLegend.horizontal('top')
		});

		return this
	},

	buildData( plotData ){
		/**
		 * Note!: Styling individual traces: so not using the layout colour schemes
		 * Therefore, on theme change traces need rebuilding
		 * if they are not stored, they won't be rebuilt!
		 */
		this.storePlotDataForThemeRebuild(plotData);


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
		function generateLimitPlotArrays(
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

        // Example usage:
		const baselinePercentage = 1.92; // 5% baseline rate

		const demoAi = ( name, colour, confidence ) => {
			const { x, y } = generateLimitPlotArrays(baselinePercentage, 1, 1000, 1, confidence);
			return {
				x,
				y,
				mode: 'lines',
				name,
				line: dataLine( colour ),
			}
		};


		const percentageGuide = ( plot, y, name, isDashed ) => ({
			...yTrace(y, plot, name),
			mode: 'lines',
			line: dataLine( colors.getColor(`grey`), isDashed ),
			hovertemplate: `%{y}%<extra></extra>`
		});

		const onePercent = ( plot, y, name, isDashed ) => ({
			...yTrace(y, { x: [1,1000], y:[1,10] }, '1%'),
			mode: 'lines',
			line: dataLine( colors.getColor(`grey`), isDashed ),
			hovertemplate: `%{y}%<extra></extra>`
		});

		const surgeon = ( plot, isCurrent = false ) => ({
			...yTrace('y1', plot, plot.name),
			mode: 'markers',
			marker: {
				symbol: 'circle',
				size: isCurrent ? 10 : 8,
				color: colors.getColor(isCurrent ? 'blue' : 'standard')
			},
			customdata: plot.surgeon,
			hovertemplate: `<b>%{customdata}</b><br>Operations: <b>%{x}</b><br>PCR Avg: <b>%{y}</b><extra></extra>`,
			legendgroup: 'surgeon'
		});


		/** plotly data **/
		this.data = [
			percentageGuide(plotData.upper99, 'y1', '99%'),
			percentageGuide(plotData.upper95, 'y1', '95%', true),
			surgeon(plotData.surgeon.other, false),
			surgeon(plotData.surgeon.current, true),
			demoAi('AI 99', '#900', 0.99),
			demoAi('AI 95', '#090', 0.95)
		];

		return this
	}
}

export const PCR_Risk = { ...core, ...build };