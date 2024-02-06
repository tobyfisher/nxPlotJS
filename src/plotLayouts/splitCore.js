import { core } from "./core";
import { getLayout } from "../getLayout";
import { addLayoutVerticals } from "./layoutAnnotations";

/**
 * Manage R / L plots shown side by side
 */
const splitPlots = {
	plots: new Map(),
	baseLayout: null,

	buildData(){
		debug.error('Use buildRightData() and/or buildLeftData()')
	},

	/**
	 * API
	 * Rather than use buildSplitData directly use these methods
	 * for the API as it's clearer which data is being provided
	 */
	buildRightData( plotData ){
		this.buildSplitData('R', plotData);
	},

	buildLeftData( plotData ){
		this.buildSplitData('L', plotData);
	},

	/**
	 * @param eye - side
	 * @param plotData
	 */
	buildSplitData( eye, plotData ){
		const side = eye === 'R' ? 'right' : 'left';

		const splitPlot = new Map();
		splitPlot.set('storedPlotData', plotData); // Store for theme change, data and layout both need rebuilding
		splitPlot.set('div', document.querySelector(`.oes-${side}-side`));
		splitPlot.set('data', this.buildDataTraces(plotData));

		/** plotly layout **/
		const sideSpecificLayout = getLayout({
			colors: `${side}EyeSeries`,
			plotTitle: `${eye + side.substring(1)} eye`,
			...this.baseLayout
		});

		// any procedures?
		if ( plotData.hasOwnProperty('procedures')){
			addLayoutVerticals(
				sideSpecificLayout,
				Object.values(plotData.procedures),
				this.procedureVericalHeight
			);
		}

		splitPlot.set('layout', sideSpecificLayout);

		/** set side specific plot */
		this.plots.set(`${eye}`, splitPlot);
	},

	setBaseLayoutForPlots( baseLayout ){
		this.baseLayout = baseLayout;
	},

	/**
	 * Overwrite core methods to
	 * handle the 2 split plots
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

	plotlyThemeChange(){
		// as layout options are used by both sides
		this.buildLayout(this.stored.get('layout'));

		[ 'R', 'L' ].forEach(eye => {
			if ( this.plots.has(eye) ){
				const side = this.plots.get(eye);
				this.buildSplitData(eye, side.get('storedPlotData'));
			}
		});

		this.plotlyReact();
	},

	/**
	 * If User adjust the layout options for a split view plot
	 */
	listenForViewLayoutChange(){
		document.addEventListener('oesLayoutChange', () => {
			[ 'R', 'L' ].forEach(eye => {
				if ( this.plots.has(eye) ){
					const side = this.plots.get(eye);
					Plotly.relayout(
						side.get('div'),
						side.get('layout')
					);
				}
			});
		});
	}

}

export const splitCore = { ...core, ...splitPlots };