import * as debug from "debug";
import { getAxis } from "../getAxis";
import { getLayout } from "../getLayout";
import { addLayoutVerticals } from "../layoutAnnotations";

export const barChart = {
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
			this.buildPlotly();
		});
	},

	/**
	 * Build or re-build plotly (if there is a theme change)
	 * if there is a theme change then completely rebuild, this is easier (more reliable)
	 * than trying to individually go through all the API and changing specific colours
	 */
	buildPlotly(){
		/**
		 * Data - for Plotly
		 * Simple traces, trace colour controlled by the Layout
		 */
		const data = this.buildDataTraces(this.raw);

		/**
		 * Axes for layout
		 */
		const x1 = getAxis({
			type: 'x',
			numTicks: 20,
		});

		const y1 = getAxis({
			type: 'y',
			numTicks: 20,
		});

		// optional titles for the axes
		const titles = this.raw.title;
		if ( titles.hasOwnProperty('xaxis') ) x1.title = titles.xaxis;
		if ( titles.hasOwnProperty('yaxis') ) y1.title = titles.yaxis;

		/**
		 * Layout
		 */
		const layout = getLayout({
			plotTitle: this.raw.title.plot,
			xaxis: x1,
			yaxes: [ y1 ],
			barmode: "stack"
		});

		addLayoutVerticals(layout, [ { name: 'Over 14 days', x: 14 } ], 1);

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
	 * Build data trace format for Glaucoma
	 * @param oe {Object} data
	 * @returns {Array} for Plot.ly data
	 */
	buildDataTraces( oe ){
		const trace = {
			y: oe.data.y,
			name: oe.data.name,
			type: 'bar'
		};
		// these are optional settings
		if ( oe.data.hasOwnProperty('x') ) trace.x = oe.data.x;
		if ( oe.data.hasOwnProperty('hovertemplate') ) trace.hovertemplate = oe.data.hovertemplate;

		return [ trace ];
	}
};