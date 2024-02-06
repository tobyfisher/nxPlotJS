import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { core } from "../core";
import { errorY } from "./parts/errorY";
import { yTrace } from "./parts/yTrace";

/**
 * Build data trace format for Glaucoma outcomes
 * @param oe {Object} data
 * @returns {Array} for Plot.ly data
 */
const buildDataTraces = ( plot ) => {

	const VA = {
		...yTrace('y1', plot.VA, 'VA'),
		hovertemplate: 'Mean ± SD<br>VA: %{y}<br>(N: %{x})',
		error_y: errorY( plot.VA )
	};

	const IOP = {
		...yTrace('y2', plot.IOP, 'IOP'),
		hovertemplate: 'Mean ± SD<br>IOP: %{y}<br>(N: %{x})',
		error_y: errorY( plot.IOP )
	};

	return [ VA, IOP ];
}

const build = {

	buildLayout( layoutData ){
		this.storeLayoutDataForThemeRebuild( layoutData );

		const x1 = getAxis({
			type: 'x',
			title: layoutData.xaxis.title,
			numTicks: 20,
			range: layoutData.xaxis.range,
		});

		const y1 = getAxis({
			type: 'y',
			title: layoutData.yaxis.y1.title,
			range: layoutData.yaxis.y1.range,
			numTicks: 20,
		});

		const y2 = getAxis({
			type: 'y',
			title: layoutData.yaxis.y2.title,
			rightSide: 'y1',
			numTicks: 20,
		});

		/** plotly layout **/
		this.layout = getLayout({
			colors: 'varied',
			legend: true,
			xaxis: x1,
			yaxes: [ y1, y2 ],
			rangeSlider: true,
		});
	},

	buildData( plotData ){
		/** plotly data **/
		this.data = buildDataTraces(plotData);
	}
}

export const outcomes_Errors = { ...core, ...build};