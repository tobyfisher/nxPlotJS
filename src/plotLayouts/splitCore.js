import { core } from "./core";
import { getLayout } from "../getLayout";
import { addLayoutVerticals } from "./layoutAnnotations";

/**
 * Manage R / L plots shown side by side
 */
const splitPlots = {
	plots: new Map(),

	buildData(){
		debug.error('Use buildRightData() and/or buildLeftData()')
	},

	/**
	 * API
	 * Rather than use buildPlot directly use these methods
	 * for the API as it's clearer which data is being provided
	 */
	buildRightData( plotData ){
		this.buildPlot('R', plotData);
	},

	buildLeftData( plotData ){
		this.buildPlot('L', plotData);
	},

	/**
	 * @param eye - side
	 * @param plotData
	 */
	buildPlot( eye, plotData ){
		const side = eye === 'R' ? 'right' : 'left';
		const plot = new Map();
		plot.set('storedPlotData', plotData); // Store for theme change, data and layout both need rebuilding
		plot.set('div', document.querySelector(`.oes-${side}-side`));
		plot.set('data', this.buildDataTraces(plotData));
		plot.set('layout', getLayout(
			Object.assign({
				colors: `${side}EyeSeries`,
				plotTitle: `${eye + side.substring(1)} eye`,
			}, this.baseLayoutOptions)
		));

		



		// Procedures
		if ( plotData.procedures ){
			addLayoutVerticals(plot.get('layout'), Object.values(plotData.procedures), this.procedureVericalHeight);
		}

		this.plots.set(`${eye}`, plot);
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
				this.buildPlot(eye, side.get('storedPlotData'));
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