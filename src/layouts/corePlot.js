import { addLayoutHorizontals, addLayoutVerticals } from "../layoutAnnotations";
import * as debug from "../debug";

export const corePlot = {
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

	setPlotlyDiv( divID ){
		if( divID === false){
			debug.log(`assuming split view DOM`);
			return;
		}

		const div = document.getElementById(divID);
		if ( div === null ){
			debug.error(`div is null: ${divID}`);
		} else {
			this.div = div;
		}
	},

	plotlyReact(){

		this.drawLines();

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

	/**
	 * Draw any vertical or horizontal line markers
	 */
	drawLines(){
		if ( this.lines.v.verticals.length ){
			addLayoutVerticals(
				this.layout,
				this.lines.v.verticals,
				this.lines.v.h);
		}
		if( this.lines.horizontals.length ){
			addLayoutHorizontals(
				this.layout,
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
	},

	listenForSplitLayoutChange(){
		document.addEventListener('oesLayoutChange', () => {
			[ 'R', 'L' ].forEach(eye => {
				if ( this.plot.has(`${eye}`) ){
					Plotly.relayout(
						this.plot.get(`${eye}`).get('div'),
						this.plot.get(`${eye}`).get('layout')
					);
				}
			});
		});
	}
}