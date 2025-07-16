import { core } from "../core";
import {customData} from "./customData";

const build = {

	buildLayout( layoutData ){
		customData.buildLayout( layoutData );
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