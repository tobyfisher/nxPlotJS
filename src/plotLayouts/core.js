import * as debug from "../debug";
import { addLayoutHorizontals, addLayoutVerticals } from "../layoutAnnotations";

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

	setup(){
		// optional setup, if required add to specific template
	},

	setPlotlyDiv( divID ){
		if( divID === false){
			debug.log(`assuming split view DOM`);
			return false;
		} else {
			this.div = document.getElementById(divID);

			if ( this.div === null ){
				debug.error(`div is null: ${divID}`);
			}
		}
	},

	plotlyReact(){

		this.drawLines( this.layout );

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
	 */
	drawLines( plotLayout ){
		if ( this.lines.v.verticals.length ){
			addLayoutVerticals(
				plotLayout,
				this.lines.v.verticals,
				this.lines.v.h);
		}
		if( this.lines.horizontals.length ){
			addLayoutHorizontals(
				plotLayout,
				this.lines.horizontals
			)
		}
	},

	addVerticalLines( array, plotHeight ){
		this.lines.v.verticals = array;
		this.lines.v.h = plotHeight;
	},

	addHorizontalLines( horizontals ){
		this.lines.horizontals = horizontals;
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