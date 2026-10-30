import { core } from "../core";
import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { yTrace } from "./parts/yTrace";
import { customTraceLine } from "./parts/lines";
import * as colors from "../../colors";
import { getLegend } from "../../getLegend";
import { generateXYforPCRCurve } from "../../helpers/PCR_curve";

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
			range: [-2,30]
		});

		/** plotly layout **/
		this.layout = getLayout({
			// plotTitle: layoutData.plotHeader,
			xaxis: x1,
			yaxes: [ y1 ],
			colors: 'duo',
			legend: getLegend.horizontal('top', 1,true)
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

		const pcrHover = (name) => `<b>${name}</b><br>Operations: <b>%{x}</b><br>PCR: <b>%{y}%</b><extra></extra>`


		const PCR_Curve = ( baseLine, confidence, name, line, group  ) => {
			const plot = generateXYforPCRCurve(baseLine, 0, 1000, 10, confidence);
			return {
				...yTrace('y1', plot, name),
				mode: 'lines',
				line,
				hovertemplate: pcrHover(name),
				legendgroup: group
			}
		}

		const PCR_average = ( avg, name, line, group ) => {
			return {
				...yTrace('y1', { y:[ avg, avg], x:[0,1000] }, name),
				mode: 'lines',
				line,
				hovertemplate: pcrHover(name),
				legendgroup: group
			}
		}

		const percentageGuide = ( plot, y, name, isDashed ) => ({
			...yTrace(y, plot, name),
			mode: 'lines',
			line: customTraceLine({ smooth: true, color: colors.getColor(`grey`), dashed: isDashed }),
			hovertemplate: pcrHover(name),
			legendgroup: "OE",
		});

		const surgeon = ( plot, isCurrent = false ) => ({
			...yTrace('y1', plot, plot.name),
			mode: 'markers',
			marker: {
				symbol: 'circle',
				size: isCurrent ? 10 : 8,
				color: isCurrent ? colors.getColor('purple') : colors.getColor( 'standard')
			},
			customdata: plot.surgeon,
			hovertemplate: `<b>%{customdata}</b><br>Operations: <b>%{x}</b><br>PCR Avg: <b>%{y}</b><extra></extra>`,
			legendgroup: 'surgeon'
		});


		/** plotly data **/
		this.data = [
			percentageGuide(plotData.upper99, 'y1', 'OE 99.8%'),
			percentageGuide(plotData.upper95, 'y1', 'OE 95%', true),

			PCR_average( plotData.NODAverage, 'NOD Average',
				customTraceLine({ color: colors.getColor(`purple`), dashed: true }), 'NOD' ),
			PCR_Curve(
				plotData.NODAverage,  0.998, 'NOD 99.8%',
				customTraceLine({ smooth: true, color: colors.getColor(`purple`) }), 'NOD' ),
			PCR_Curve(
				plotData.NODAverage,  0.95, 'NOD 95%',
				customTraceLine({ smooth: true, color: colors.getColor(`purple`), dashed: true }), 'NOD' ),

			PCR_average(
				plotData.LocalAverage, 'Local Average',
				customTraceLine({ color: colors.getColor(`orange`), dashed: true }), 'Local' ),
			PCR_Curve(
				plotData.LocalAverage,  0.998, 'Local 99.8%',
				customTraceLine({ smooth: true, color: colors.getColor(`orange`) }), 'Local' ),
			PCR_Curve(
				plotData.LocalAverage,  0.95, 'Local 95%',
				customTraceLine({ smooth: true, color: colors.getColor(`orange`), dashed: true }), 'Local' ),

			surgeon(plotData.surgeon.other, false),
			surgeon(plotData.surgeon.current, true),
		];

		return this
	}
}

export const PCR_Risk = { ...core, ...build };