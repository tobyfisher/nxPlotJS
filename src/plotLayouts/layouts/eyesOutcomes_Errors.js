import * as colors from "../../colors";
import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { core } from "../core";
import { errorY } from "./parts/errorY";
import { yTrace } from "./parts/yTrace";
import { dataLine } from "./parts/lines";

const trace = ( plot, y, name, eye, lineColor ) => ({
	...yTrace(y, plot, `${name} ${eye}`),
	hovertemplate: `Mean ± SD<br>${name}: %{y}<br>(N: %{x})`,
	line: dataLine(lineColor, true),
	error_y: errorY(plot)
});

const build = {

	buildLayout( layoutData ){
		this.storeLayoutDataForThemeRebuild(layoutData);

		const x1 = getAxis({
			type: 'x',
			numTicks: 10,
			spikes: true,
			noMirrorLines: true,
		});

		// CRT
		const y1 = getAxis({
			type: 'y',
			title: layoutData.yaxis.y1.title,
			range: layoutData.yaxis.y1.range, // hard coded range
			spikes: true,
		});

		// VA (logMar or whatever is passed in)
		const y2 = getAxis({
			type: 'y',
			title: layoutData.yaxis.y2.title,
			range: layoutData.yaxis.y2.range, // hard coded range
			rightSide: 'y1',
			spikes: true,
		});

		/** plotly layout **/
		this.layout = getLayout({
			legend: true,
			xaxis: x1,
			yaxes: [ y1, y2 ],
			rangeSlider: true,
		});
	},

	buildData( plotData ){
		this.storePlotDataForThemeRebuild(plotData);
		let data = [];

		/**
		 * Data traces for Eyes
		 * it can handle 'R', 'L' and 'BEO' - all optional
		 * so, need to check what data is provided...
		 */
		const eyeDataTypes = {
			rightEye: 'R',
			leftEye: 'L',
			BEO: 'BEO'
		}

		for ( const eyeType of Object.keys(eyeDataTypes) ){
			if ( plotData.hasOwnProperty(eyeType) ){
				const colorSeries = colors.getColorSeries(`${eyeType}Series`);
				const shortName = eyeDataTypes[eyeType];

				data = data.concat([
					trace(plotData[eyeType].CRT, 'y1', 'CRT', shortName, colorSeries[1]),
					trace(plotData[eyeType].VA, 'y2', 'VA', shortName, colorSeries[0]),
				]);
			}
		}

		/** plotly data **/
		this.data = data;
	}
}

export const eyesOutcomes_Errors = { ...core, ...build };