import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { core } from "../core";
import { errorY } from "./parts/errorY";
import { yTrace } from "./parts/yTrace";

const trace = ( plot, y, name ) => ({
	...yTrace(y, plot, name),
	hovertemplate: `Mean ± SD<br>${name}: %{y}<br>(N: %{x})`,
	error_y: errorY( plot )
});

const build = {

	buildLayout( layoutData ){
		this.storeLayoutDataForRebuild( layoutData );

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
		this.data = [
			trace( plotData.VA, 'y1', 'VA'),
			trace( plotData.IOP, 'y2', 'IOP')
		];
	}
}

export const outcomes_Errors = { ...core, ...build};