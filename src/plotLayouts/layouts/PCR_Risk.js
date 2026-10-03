import { core } from "../core";
import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { yTrace } from "./parts/yTrace";
import { errorY } from "./parts/errorY";
import { dataLine } from "./parts/lines";
import * as colors from "../../colors";

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
			// plotTitle: layoutData.plotHeader,
			xaxis: x1,
			yaxes: [ y1 ],
			colors: 'posNeg'
		});

		return this
	},

	buildData( plotData ){
		/**
		 * Note!: Styling individual traces: so not using the layout colour schemes
		 * Therefore, on theme change traces need rebuilding
		 * if they are not stored, they won't be rebuilt!
		 */
		this.storePlotDataForThemeRebuild(plotData);

		const percentageGuide = ( plot, y, name, isDashed ) => ({
			...yTrace(y, plot, name),
			mode: 'lines',
			line: dataLine( colors.getColor(`grey`), isDashed ),
			hovertemplate: `%{y}%<extra></extra>`
		});

		const surgeon = ( plot, isCurrent = false ) => ({
			...yTrace('y1', plot, "Surgeon"),
			mode: 'markers',
			marker: {
				symbol: isCurrent ? 'square' : 'circle',
				size: isCurrent ? 12 : 8,
				color: colors.getColor(isCurrent ? 'orange' : 'standard')
			},
			hovertemplate: `<b>${plot.name}</b><br>Operations: <b>%{x}</b><br>PCR Avg: <b>%{y}</b>`,
		});


		/** plotly data **/
		this.data = [
			percentageGuide(plotData.upper99, 'y1', '99%'),
			percentageGuide(plotData.upper95, 'y1', '95%', true),
			surgeon(plotData.surgeon.current, true)
		];

		// Show "all" surgeons if array
		const allSurgeons = plotData.surgeon.all;
		if( allSurgeons.length ){
			allSurgeons.forEach( plotData => {
				this.data.push(
					surgeon(plotData)
				)
			});
		}

		return this
	}
}

export const PCR_Risk = { ...core, ...build };