import * as colors from "../../colors";
import * as helpers from "../../helpers";
import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { core } from "../core";
import { errorY } from "./parts/errorY";
import { yTrace } from "./parts/yTrace";
import { dataLine } from "./parts/lines";

/**
 * Build data traces
 * @param eye {Object} data
 * @param colorSeries {Array}
 * @param titleEye {String}
 * @returns {Array} for Plot.ly data
 */
const buildDataTraces = function ( eye, colorSeries, titleEye ){
	const CRT = {
		...yTrace('y1', eye.CRT, `CRT ${titleEye}`),
		hovertemplate: 'Mean ± SD<br>CRT: %{y}<br>(N: %{x})',
		line: dataLine(colorSeries[1], true),
		error_y: errorY( eye.CRT )
	};

	const VA = {
		...yTrace('y2', eye.VA, `VA ${titleEye}`),
		mode: 'lines+markers',
		hovertemplate: 'Mean ± SD<br>VA: %{y}<br>(N: %{x})',
		line: dataLine(colorSeries[0]),
		error_y: errorY( eye.VA )
	};

	return [ VA, CRT ];
}

const build = {

	buildLayout( layoutData ){
		this.storeLayoutDataForThemeRebuild( layoutData );

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
		this.storePlotDataForThemeRebuild( plotData );

		/**
		 * Data traces for Eyes!
		 * can handle 'R', 'L' and 'BEO' - all optional
		 * need to check if the data is provided...
 		 */


		let data = [];

		let eyeTraces = new Map([
			[ 'R', 'rightEye' ],
			[ 'L', 'leftEye' ],
			[ 'BEO', 'BEO' ],
		]);

		eyeTraces.forEach(( eyeData, eye ) => {

			if ( plotData.hasOwnProperty(eyeData) ){

				const traces = buildDataTraces(
					plotData[eyeData],
					colors.getColorSeries(`${eyeData}Series`),
					`(${eye})`
				);

				data = data.concat(traces)
			}
		});

		/** plotly data **/
		this.data = data;
	}
}

export const eyesOutcomes_Errors = { ...core, ...build};