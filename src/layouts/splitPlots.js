import { corePlot } from "./corePlot";

const splitPlots = Object.create(corePlot);

splitPlots.plots = new Map();

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