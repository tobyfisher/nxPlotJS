import { core } from "../core";
import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { yTrace } from "./parts/yTrace";
import { errorY } from "./parts/errorY";

const build = {

	buildLayout( layoutData ){
		this.storeLayoutDataForRebuild(layoutData);

		const x1 = getAxis({
			type: 'x',
			numTicks: 20,
			title: layoutData.xaxis.title,
			range: [0,1000]
		});

		const y1 = getAxis({
			type: 'y',
			numTicks: 20,
			title: layoutData.yaxis.y1.title,
			range: [0,50]
		});

		/** plotly layout **/
		this.layout = getLayout({
			plotTitle: layoutData.plotHeader,
			xaxis: x1,
			yaxes: [ y1 ],
			colors: 'posNeg'
		});

		return this
	},

	buildData( plotData ){
		const customTrace = ( plot, y, name ) => ({
			...yTrace(y, plot, name, 'line')
		});

		/** plotly data **/
		this.data = [
			customTrace(plotData.upper99, 'y1', '99%'),
			customTrace(plotData.upper95, 'y1', '95%')
		];

		return this
	}
}

export const PCR_Risk = { ...core, ...build };