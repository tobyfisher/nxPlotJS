import { core } from "./core";
import { getLayout } from "../getLayout";
import { addLayoutVerticals } from "../layoutAnnotations";

const splitPlots = Object.create(core);

splitPlots.plots = new Map();

splitPlots.buildPlot = function ( eye, plotData ){
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
	if( plotData.procedures ){
		addLayoutVerticals( plot.get('layout'), Object.values( plotData.procedures ), this.procedureVericalHeight);
	}

	this.plots.set(`${eye}`, plot);
}

/**
 * Rather than use buildPlot (above) directly use this
 * as the API in DOM, clearer which data is being provided
 */
splitPlots.buildRightData = function ( plotData ){
	this.buildPlot('R', plotData);
}
splitPlots.buildLeftData = function ( plotData ){
	this.buildPlot('L', plotData);
}

/**
 * Overwrite corePlot
 */
splitPlots.plotlyReact = function (){
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
};

/**
 * Build or re-build plotly (if there is a theme change)
 * A complete rebuild is easier (more reliable) than trying to
 * individually go through all the API and change specific colours
 */
splitPlots.plotlyThemeChange = function (){
	// as layout options are used by both sides
	this.buildLayout( this.stored.get('layout'));

	[ 'R', 'L' ].forEach(eye => {
		if ( this.plots.has(eye) ){
			const side = this.plots.get(eye);
			this.buildPlot(eye, side.get('storedPlotData'));
		}
	});

	this.plotlyReact();
};

/**
 * If User adjust the layout options for a split view plot
 */
splitPlots.listenForViewLayoutChange = function (){
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
};

export { splitPlots }