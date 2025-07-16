import { core } from "./core";
import { getLayout } from "../getLayout";
import { addLayoutVerticals } from "./layoutAnnotations";
import * as debug from "../debug";
import { getAxis } from "../getAxis";
import { yTrace } from "./layouts/parts/yTrace";
import { eventStyle } from "./layouts/parts/eventStyle";
import { toolBar } from "../toolBar";
import { changeSplitLayout } from "../changeSplitLayout";

/**
 * Manage R / L plots shown side by side
 */
const splitPlots = {
	plots: new Map(),
	toolBar: null,
	baseLayout: null,

	buildData(){
		debug.error('Split plots use buildRightData() and/or buildLeftData() instead')
	},

	buildDataTraces(){
		debug.error('Override in specific split layout!');
		return {};
	},

	/**
	 * API
	 * Rather than use buildSplitData directly use these methods
	 * for the API as it's clearer which data is being provided
	 * @param plotData - JSON from DOM
	 */
	buildRightData( plotData ){
		this.buildSplitData('R', plotData);
		return this
	},

	buildLeftData( plotData ){
		this.buildSplitData('L', plotData);
		return this
	},

	/**
	 * API uses the above methods to access this
	 */
	buildSplitData( eye, plotData ){
		const side = eye === 'R' ? 'right' : 'left';
		const div = document.querySelector(`.oes-${side}-side`);
		if ( div === null ){
			debug.error(`Requires fixed DOM structure, can not find: div.'.oes-${side}-side'`);
		} else {
			// setup header to allow User to change split layout balance
			changeSplitLayout.init( this );
		}

		const eyePlot = new Map();
		eyePlot.set('storedPlotData', plotData); // for rebuilding
		eyePlot.set('div', div);
		eyePlot.set('data', this.buildDataTraces(plotData)); // note: see specific split plot layout

		/** plotly layout **/
		const sideSpecificLayout = getLayout({
			colors: `${side}EyeSeries`,
			plotTitle: `${eye + side.substring(1)} eye`,
			...this.baseLayout
		});

		// any procedures?
		if ( plotData.hasOwnProperty('procedures') ){
			addLayoutVerticals(
				sideSpecificLayout,
				Object.values(plotData.procedures),
				this.procedureVericalHeight
			);
		}

		eyePlot.set('layout', sideSpecificLayout);

		/** set side specific plot */
		this.plots.set(`${eye}`, eyePlot);
	},

	/**
	 * Each specific split layout will set this up
	 * the layout is used for both split plots
	 */
	setBaseLayoutForPlots( layoutSpecific ){
		// timeline
		const x1 = getAxis({
			type: 'x',
			numTicks: 10,
			useDates: true,
			spikes: true,
			noMirrorLines: true,
		});

		const base = {
			legend: { yanchor: 'bottom' },
			xaxis: x1,
			rangeSlider: true,
			dateRangeButtons: true,
		};

		this.baseLayout = { ...base, ...layoutSpecific };
	},

	/**
	 * Events subplot
	 * @returns {Array}
	 */
	buildEvents( events, y ){
		/**
		 * Event data are all individual traces
		 * ALL the Y values are the SAME, to look like a horizontal bar
		 * extra data for the popup can be passed in with customdata
		 */
		return Object.values( events ).map(( event ) => ({
			oeEventType: event.event, // store event type
			...yTrace(y, event, event.name),
			...eventStyle(event.event),
			customdata: event.customdata,
			hovertemplate: event.customdata ?
				'%{y}<br>%{customdata}<br>%{x}<extra></extra>' :
				'%{y}<br>%{x}<extra></extra>',
			showlegend: false
		}));
	},

	/**
	 * Overwrite core to handle the 2 split plots
	 */
	plotlyReact(){
		[ 'R', 'L' ].forEach(eye => {
			if ( this.plots.has(eye) ){
				const side = this.plots.get(eye);

				this.drawLines(side.get('layout'));

				Plotly.react(
					side.get('div'),
					side.get('data'),
					side.get('layout'),
					{ displayModeBar: false, responsive: true }
				);
			}
		});
	},

	rebuild(){
		// the same layout options are used by both sides
		this.buildLayout(this.stored.get('layout'));

		[ 'R', 'L' ].forEach(eye => {
			if ( this.plots.has(eye) ){
				const side = this.plots.get(eye);
				this.buildSplitData(eye, side.get('storedPlotData'));
			}
		});

		this.plotlyReact();
	},

	plotlyThemeChange(){
		this.rebuild();
	},

	/**
	 * If User changes the layout balance then
	 * Plotly need to "re-layout" the plots
	 * see: changeSplitLayout.js
	 */
	relayoutPlots(){
		[ 'R', 'L' ].forEach(eye => {
			if ( this.plots.has(eye) ){
				const side = this.plots.get(eye);
				Plotly.relayout(
					side.get('div'),
					side.get('layout')
				);
			}
		});
	}
}

export const splitCore = { ...core, ...splitPlots };