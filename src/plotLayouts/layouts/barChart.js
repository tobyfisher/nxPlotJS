import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { core } from "../core";

const build = {

	buildData( plotData ){
		/**
		 * Data - for Plotly
		 * Simple traces, trace colour controlled by the Layout
		 */
		const trace = {
			y: plotData.y,
			name: plotData.name,
			type: 'bar'
		};

		// these are optional settings
		if ( plotData.hasOwnProperty('x') ) trace.x = plotData.x;
		if ( plotData.hasOwnProperty('hovertemplate') ) trace.hovertemplate = plotData.hovertemplate;

		this.data =  [ trace ];
	},

	buildLayout( layoutData ){
		// store layout data for rebuilding on theme change
		if( !this.stored.has("layout" ) ){
			this.stored.set("layout", layoutData);
		}

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

		this.layout = getLayout({
			plotTitle: layoutData.plotHeader,
			xaxis: x1,
			yaxes: [ y1 ],
			barmode: "stack"
		});
	}
}

export const barChart = { ...core, ...build};