import { addLayoutVerticals } from "../layoutAnnotations";

export const coreLayout = {
	div: null,
	data: [],
	layout: {},
	verticalLineMarkers: {
		verticals: [],
		h: 0,
	},
	stored: new Map(),

	setPlotlyDiv( divID ){
		const div = document.getElementById(divID);
		if ( div === null ){
			console.error(`[nxPlot] div is null: ${divID}`);
		} else {
			this.div = div;
		}
	},

	plotlyReact(){
		/**
		 * Draw any vertical or horizontal markers
		 */
		if ( this.verticalLineMarkers.verticals.length ){
			addLayoutVerticals(
				this.layout,
				this.verticalLineMarkers.verticals,
				this.verticalLineMarkers.h);
		}

		/**
		 * Standard initiate Plot.ly
		 * Use "react" for new (or re-build)
		 */
		Plotly.react(
			this.div,
			this.data,
			this.layout,
			{ displayModeBar: false, responsive: true }
		);
	},

	addVerticalMarkers( arrayOfVerticals, plotHeight ){
		this.verticalLineMarkers.verticals = arrayOfVerticals;
		this.verticalLineMarkers.h = plotHeight;
	}
}