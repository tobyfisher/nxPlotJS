import { corePlot } from "./corePlot";

const splitPlots = Object.create(corePlot);

splitPlots.splitPlots = new Map();

splitPlots.plotlyReact = function(){

	this.drawLines();

	[ 'R', 'L' ].forEach(eye => {
		if ( this.splitPlots.has(`${eye}`) ){
			const side = this.splitPlots.get(`${eye}`);
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
 * If User adjust the layout options for a split view plot
 */
splitPlots.listenForSplitLayoutChange = function(){
	document.addEventListener('oesLayoutChange', () => {
		[ 'R', 'L' ].forEach(eye => {
			if ( this.split.has(`${eye}`) ){
				Plotly.relayout(
					this.split.get(`${eye}`).get('div'),
					this.split.get(`${eye}`).get('layout')
				);
			}
		});
	});
};

export { splitPlots }