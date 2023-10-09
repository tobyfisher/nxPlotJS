import * as debug from "debug";
import * as colors from "../colors";
import * as helpers from "../helpers";
import { getAxis } from "../getAxis";
import { getLayout } from "../getLayout";

export const eyesOutcome_Errors = {
	/**
	 * init from DOM
	 * if there is a theme change then re-initiate, as this is easier (& more reliable)
	 * @param oePlotData {Object | Boolean} - agreed data structure passed in from DOM or false on theme change
	 * @param divID {String}
	 */
	init( oePlotData, divID ){
		// first time store the raw oe data passed in from DOM
		this.raw = oePlotData;
		this.div = document.getElementById(divID);

		this.buildPlotly();

		/**
		 * Users changes the theme, re-initialise to re-draw with correct colours
		 */
		document.addEventListener('oeThemeChange', () => {
			this.buildPlotly( );
		});
	},

	buildPlotly(){
		/**
		 * Data - Plot for Left & Right eyes
		 * Colours for each eye trace have to be set on the data trace
		 */
		let data = [];

		[ 'R', 'L' ].forEach(rl => {
			const full = rl === 'R' ? 'right' : 'left';

			if ( this.raw.hasOwnProperty(`${full}Eye`) ){
				data = data.concat(this.buildDataTraces(
					this.raw[`${full}Eye`],
					colors.getColorSeries(`${full}EyeSeries`),
					`(${rl}E)`
				));
			}
		});

		/**
		 * Axes for layout
		 */
		const x1 = getAxis({
			type: 'x',
			numTicks: 10,
			spikes: true,
			noMirrorLines: true,
		});

		// CRT
		const y1 = getAxis({
			type: 'y',
			title: 'CRT',
			range: this.raw.yaxis.CRT, // hard coded range
			spikes: true,
		});

		// VA (logMar or whatever is passed in)
		const y2 = getAxis({
			type: 'y',
			title: 'VA',
			range: this.raw.yaxis.VA, // hard coded range
			rightSide: 'y1',
			spikes: true,
		});

		/**
		 * Layout
		 */
		const layout = getLayout({
			legend: true,
			xaxis: x1,
			yaxes: [ y1, y2 ],
			rangeSlider: true,
		});

		/**
		 * Standard initiate Plot.ly
		 * Use "react" for new (or re-build)
		 */
		Plotly.react(
			this.div,
			data,
			layout,
			{ displayModeBar: false, responsive: true }
		);
	},

	/**
	 * Build data traces
	 * @param eye {Object} data
	 * @param colorSeries {Array}
	 * @param titleEye {String}
	 * @returns {Array} for Plot.ly data
	 */
	buildDataTraces( eye, colorSeries, titleEye ){

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
};
