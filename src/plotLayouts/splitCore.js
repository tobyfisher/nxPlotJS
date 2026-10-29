import { core } from "./core";
import { getLayout } from "../getLayout";
import { addLayoutVerticals, annotateEventNames } from "./layoutAnnotations";
import * as debug from "../debug";
import { getAxis } from "../getAxis";
import { log } from "../debug";
import { addReportDateLine } from "./reportDateLine";

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

	buildSideDataTraces(){
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
	 * API (in HTML) uses the above methods to access this
	 */
	buildSplitData( eye, plotData ){
		const side = eye === 'R' ? 'right' : 'left';
		const div = this.splitDiv.get(side);

		const eyePlot = new Map();
		eyePlot.set('storedPlotData', plotData); // for rebuilding
		eyePlot.set('div', div);
		eyePlot.set('data', this.buildSideDataTraces(plotData, side)); // note: see specific split plot layout

		/** plotly layout **/
		const sideSpecificLayout = getLayout({
			colors: `${side}Eye`,
			...this.baseLayout
		});

		// Event annotations (replaces Y axis labels because drugs names are long!)
		if( this.eventAnnotations.length){
			sideSpecificLayout.annotations = sideSpecificLayout.annotations.concat(this.eventAnnotations);
		}

		// any reports?
		if ( plotData.hasOwnProperty('reports') ){
			// add report date line and track shape index
			const shapeIndex = addReportDateLine( sideSpecificLayout, "2027-01-01" );
			eyePlot.set('reportShapeIndex', `shapes[${shapeIndex}]`);
		}

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
	 * Each split layout will request this, it is the
	 * "base" layout that is used for both split plots
	 */
	setBaseLayoutForSplitPlots( layoutSpecific ){

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
	 * Replace Event yAxis tick labels with Annotations
	 * however, need to store and add them later after getLayout();
	 */
	addEventAnnotations( eventNames, yaxis){
		this.eventAnnotations = annotateEventNames( eventNames, yaxis );
	},

	/**
	 * Overwrite core to handle the 2 split plots
	 */
	plotlyReact(){
		[ 'R', 'L' ].forEach(eye => {
			if ( this.plots.has(eye) ){
				const side = this.plots.get(eye);

				this.drawLines(side.get('layout'));

				log(`"${eye}" side: plotly.react()`);

				Plotly.react(
					side.get('div'),
					side.get('data'),
					side.get('layout'),
					{ displayModeBar: false, responsive: true }
				);

				// side.get('div').on('plotly_hover', function(data){
				// 	console.log( data );
				// })
			}
		});
	},


	rebuild(){
		log('splitCore: rebuild plots');
		log('updating colours in base layout for both sides');
		// the same layout options are used by both sides
		this.buildLayout(this.stored.get('layout'));

		[ 'R', 'L' ].forEach(eye => {
			if ( this.plots.has(eye) ){
				log(`"${eye}" side: update colours using stored data`);
				const side = this.plots.get(eye);
				this.buildSplitData(eye, side.get('storedPlotData'));
			}
		});

		this.plotlyReact();
	},

	relayout(){
		log('splitCore: relayout()');
		const update = {
			hovermode: this.toolBar.getHoverMode()
		};

		[ 'R', 'L' ].forEach(eye => {
			if ( this.plots.has(eye) ){
				log(`"${eye}" side: plotly.relayout()`);
				const side = this.plots.get(eye);
				Plotly.relayout(side.get('div'), update)
			}
		});
	},

	/**
	 * Report need to show where they exist on the appropriate plot
	 * @param eye
	 * @param isoDate
	 */
	highlightDate( eye, isoDate = "" ){
		if( this.plots.has(eye) === false ) return;
		const side = this.plots.get(eye);

		if( side.has('reportShapeIndex') === false) return;

		const shapeRef = side.get('reportShapeIndex');

		const update = {};
		update[`${shapeRef}.visible`] = (isoDate !== "");
		update[`${shapeRef}.x0`] = isoDate;
		update[`${shapeRef}.x1`] = isoDate;

		Plotly.relayout(side.get('div'), update);
	},

	plotlyThemeChange(){
		this.rebuild();
	},

	/**
	 * Purge - wipe and start again
	 */
	purge(){
		[ 'R', 'L' ].forEach(eye => {
			if ( this.plots.has(eye) ){
				const side = this.plots.get(eye);
				Plotly.purge(side.get('div'));
			}
		});
	}
}

export const splitCore = { ...core, ...splitPlots };