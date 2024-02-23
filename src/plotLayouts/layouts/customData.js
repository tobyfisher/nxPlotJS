import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { core } from "../core";

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

	buildData( dataTrace ){

		/** plotly data **/
		this.data = dataTrace;

		return this
	}
}

export const customData = { ...core, ...build };