import { core } from "../core";
import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";

const build = {

	buildLayout( layoutData ){
		this.storeLayoutDataForRebuild(layoutData);

		const x1 = getAxis({
			type: 'x',
			numTicks: 20,
			title: layoutData.xaxis.title
		});

		const y1 = getAxis({
			type: 'y',
			numTicks: 20,
			title: layoutData.yaxis.y1.title
		});

		/** plotly layout **/
		this.layout = getLayout({
			plotTitle: layoutData.plotHeader,
			xaxis: x1,
			yaxes: [ y1 ],
			barmode: "stack"
		});

		return this
	},

	buildData( plotData ){
		/**
		 * Data - for Plotly
		 * Simple trace, trace colours controlled by the Layout
		 */
		const trace = {
			y: plotData.y,
			name: plotData.name,
			type: 'bar'
		};

		// optional trace settings if provide by plotData:
		if ( plotData.hasOwnProperty('x') ) trace.x = plotData.x;
		if ( plotData.hasOwnProperty('hovertemplate') ) trace.hovertemplate = plotData.hovertemplate;

		/** plotly data **/
		this.data = [ trace ];

		return this
	}
}

export const barChart = { ...core, ...build };