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
	storeKeys: {
		layout: 'layout',
		plot: 'plot'
	},
	stored: new Map(),

	/**
	 * API
	 */
	setSelectableUnits(){
		debug.error('needs overwriting in specific layout');
	},

	buildData(){
		// Each layout must overwrite this build
		// (except SplitPlots see splitPlots.js)
	},
	buildLayout(){
		// Each layout must overwrite this build
	},

	addVerticalLines( array, plotHeight ){
		if ( !Array.isArray(array) ) debug.error('core', 'addVerticalLines requires an Array');
		this.lines.v.verticals = array;
		this.lines.v.h = plotHeight;
		return this
	},

	addHorizontalLines( array ){
		if ( !Array.isArray(array) ) debug.error('core', 'addHorizontalLines requires an Array');
		this.lines.horizontals = array;
		return this
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
	 * @param layout
	 * note: layout could be coming from 'splitCore.js'!
	 * i.e. a "R" and "L" layout object
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
	prebuild(){
		// optional pre-build setup hook
	},

	setPlotlyDiv( divID ){
		if ( divID === false ){
			debug.log(`assuming split view DOM is available...`);
			return false;
		} else {
			this.div = document.getElementById(divID);
			if ( this.div === null ){
				debug.error(`div is null: ${divID}`);
			}
		}
	},

	/**
	 * when theme change happens need to reuse original layout data
	 * splitCore does this a bit differently
	 */
	storeLayoutDataForRebuild( layoutData ){
		if ( !this.stored.has(this.storeKeys.layout) ){
			this.stored.set(this.storeKeys.layout, layoutData);
		}
	},

	storePlotDataForThemeRebuild( plotData ){
		if ( !this.stored.has(this.storeKeys.plot) ){
			this.stored.set(this.storeKeys.plot, plotData);
		}
	},

	rebuild(){
		if ( this.stored.has(this.storeKeys.plot) ){
			this.buildData(this.stored.get(this.storeKeys.plot));
		}
		if ( this.stored.has(this.storeKeys.layout) ){
			this.buildLayout(this.stored.get(this.storeKeys.layout));
		}

		this.plotlyReact();
	},

	/**
	 * Build or re-build plotly (if there is a theme change)
	 * A complete rebuild is easier (more reliable) than trying to
	 * individually go through all the API and change specific colours
	 */
	plotlyThemeChange(){
		this.rebuild();
	}
}