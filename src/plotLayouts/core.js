import * as debug from "../debug";
import { addLayoutHorizontals, addLayoutVerticals } from "./layoutAnnotations";

export const core = {
	div: null,
	data: [],
	layout: {},
	lines: {
		v: {
			verticals: [],
			h: 0
		},
		horizontals: [],
	},
	stored: new Map(),

	/**
	 * API
	 */
	buildData(){
		// Each layout must overwrite this build
		// (except SplitPlots see splitPlots.js)
	},
	buildLayout(){
		// Each layout must overwrite this build
	},

	addVerticalLines( array, plotHeight ){
		if ( !Array.isArray( array) ) debug.error('core', 'addVerticalLines requires an Array');
		this.lines.v.verticals = array;
		this.lines.v.h = plotHeight;
	},

	addHorizontalLines( array ){
		if ( !Array.isArray( array) ) debug.error('core', 'addHorizontalLines requires an Array');
		this.lines.horizontals = array;
	},

	plotlyReact(){
		this.drawLines(this.layout);
		/**
		 * Standard initiate Plot.ly
		 * Use "react" for new plot or re-building a plot
		 */
		Plotly.react(
			this.div,
			this.data,
			this.layout,
			{ displayModeBar: false, responsive: true }
		);
	},

	/**
	 * Draw any vertical or horizontal line markers
	 * @param layout - note: this could be coming from 'splitCore.js'!
	 */
	drawLines( layout ){
		if ( this.lines.v.verticals.length ){
			addLayoutVerticals(
				layout,
				this.lines.v.verticals,
				this.lines.v.h);
		}
		if ( this.lines.horizontals.length ){
			addLayoutHorizontals(
				layout,
				this.lines.horizontals
			)
		}
	},

	/**
	 * Called by app.js
	 */
	setup(){
		// optional setup, always called, override if needed
	},

	setPlotlyDiv( divID ){
		if ( divID === false ){
			debug.log(`assuming split view DOM`);
			return false;
		} else {
			this.div = document.getElementById(divID);
			if ( this.div === null ){
				debug.error(`div is null: ${divID}`);
			}
		}
	},

	/**
	 * Build or re-build plotly (if there is a theme change)
	 * A complete rebuild is easier (more reliable) than trying to
	 * individually go through all the API and change specific colours
	 */
	plotlyThemeChange(){
		if ( this.stored.has("plot") ){
			this.buildData(this.stored.get("plot"));
		}
		if ( this.stored.has("layout") ){
			this.buildLayout(this.stored.get("layout"));
		}

		this.plotlyReact();
	}
}