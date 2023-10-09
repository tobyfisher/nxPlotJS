import * as debug from "debug";
import * as colors from "../colors";
import { getAxis } from "../getAxis";
import { getLayout } from "../getLayout";

export const outcomes_Errors = {
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
		 * Data
		 * Simple traces, trace colour controlled by the Layout
		 */
		const data = this.buildDataTraces(this.raw);

		/**
		 * Axes for layout
		 */
		const x1 = getAxis({
			type: 'x',
			title: 'Weeks',
			numTicks: 20,
			range: [ -20, 220 ],
		});

		const y1 = getAxis({
			type: 'y',
			title: 'VA (change) from baseline (LogMAR)',
			range: [ 70, 110 ],
			numTicks: 20,
		});

		const y2 = getAxis({
			type: 'y',
			title: 'IOP (mm Hg)',
			rightSide: 'y1',
			numTicks: 20,
		});

		/**
		 * Layout
		 */
		const layout = getLayout({
			colors: 'varied',
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
	 * Build data trace format for Glaucoma outcomes
	 * @param oe {Object} data
	 * @returns {Array} for Plot.ly data
	 */
	buildDataTraces( oe ){

		const VA = {
			yaxis: 'y1', // y1 = y = default
			x: oe.VA.x,
			y: oe.VA.y,
			name: 'VA',
			hovertemplate: 'Mean ± SD<br>VA: %{y}<br>(N: %{x})',
			type: 'scatter',
			error_y: {
				type: 'data',
				array: oe.VA.error_y,
				visible: true,
				thickness: 0.5,
			}
		};

		const IOP = {
			yaxis: 'y2',
			x: oe.IOP.x,
			y: oe.IOP.y,
			name: 'IOP',
			hovertemplate: 'Mean ± SD<br>IOP: %{y}<br>(N: %{x})',
			type: 'scatter',
			error_y: {
				type: 'data',
				array: oe.IOP.error_y,
				visible: true,
				thickness: 0.5,
			}
		};

		/*
		Data trace array
		*/
		return [ VA, IOP ];
	}
};