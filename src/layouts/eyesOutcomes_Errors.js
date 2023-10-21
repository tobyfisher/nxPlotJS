import * as colors from "../colors";
import * as helpers from "../helpers";
import { getAxis } from "../getAxis";
import { getLayout } from "../getLayout";
import { corePlot } from "./corePlot";

const eyesOutcome_Errors = Object.create(corePlot);

/**
 * Build data traces
 * @param eye {Object} data
 * @param colorSeries {Array}
 * @param titleEye {String}
 * @returns {Array} for Plot.ly data
 */
const buildDataTraces = function ( eye, colorSeries, titleEye ){
	const CRT = {
		yaxis: 'y1', // y1 = y = default
		x: eye.CRT.x,
		y: eye.CRT.y,
		name: `CRT ${titleEye}`,
		hovertemplate: 'Mean ± SD<br>CRT: %{y}<br>(N: %{x})',
		type: 'scatter',
		line: helpers.dataLine({
			color: colorSeries[1],
			dashed: true,
		}),
		error_y: {
			type: 'data',
			array: eye.CRT.error_y,
			visible: true,
			thickness: 0.5,
		}
	};

	const VA = {
		yaxis: 'y2',
		x: eye.VA.x,
		y: eye.VA.y,
		name: `VA ${titleEye}`,
		hovertemplate: 'Mean ± SD<br>VA: %{y}<br>(N: %{x})',
		type: 'scatter',
		mode: 'lines+markers',
		line: helpers.dataLine({
			color: colorSeries[0]
		}),
		error_y: {
			type: 'data',
			array: eye.VA.error_y,
			visible: true,
			thickness: 0.5,
		}
	};

	return [ VA, CRT ];
}

eyesOutcome_Errors.buildData = function ( plotData ){

	// store layout data for rebuilding on theme change
	if( !this.stored.has("plot" ) ){
		this.stored.set("plot", plotData);
	}

	let data = [];
	/**
	 * Data - Plot for Left & Right eyes
	 * Colours for each eye trace have to be set on the data trace
	 */
	[ 'R', 'L' ].forEach(eye => {
		const full = eye === 'R' ? 'right' : 'left';

		if ( plotData.hasOwnProperty(`${full}Eye`) ){

			const traces = buildDataTraces(
				plotData[`${full}Eye`],
				colors.getColorSeries(`${full}EyeSeries`),
				`(${eye}E)`
			);

			data = data.concat(traces)
		}
	});

	this.data = data;
}

eyesOutcome_Errors.buildLayout = function ( layoutData ){

	// store layout data for rebuilding on theme change
	if( !this.stored.has("layout" ) ){
		this.stored.set("layout", layoutData);
	}

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

	/**
	 * Layout
	 */
	this.layout = getLayout({
		legend: true,
		xaxis: x1,
		yaxes: [ y1, y2 ],
		rangeSlider: true,
	});
};

export { eyesOutcome_Errors }
