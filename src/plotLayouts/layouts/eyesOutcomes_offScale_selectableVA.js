import * as colors from "../../colors";
import * as helpers from "../../helpers";
import * as debug from "../../debug";
import { getAxis } from "../../getAxis";
import { getAxisTypeForRange } from "../../getAxisTypeForRange";
import { getLayout } from "../../getLayout";
import { toolBar } from "../../toolBar";
import { core } from "../core";
import { dataLine } from "./parts/lines";
import { yTrace } from "./parts/yTrace";


const buildDataTraces = ( eye, colorSeries, titleSuffix, vaUnit ) => {

	const offScale = {
		...yTrace('y1', eye.VA.offScale, `${eye.VA.offScale.name} ${titleSuffix}`),
		mode: 'lines+markers',
		hovertemplate: '%{y}<br>%{x}',
		line: dataLine(colorSeries[0])
	};

	const CRT = {
		...yTrace('y2', eye.CRT, `${eye.CRT.name} ${titleSuffix}`),
		mode: 'lines+markers',
		hovertemplate: 'CRT: %{y}<br>%{x}',
		line: dataLine(colorSeries[1], true),
	};

	const selectedVA = eye.VA.units[ vaUnit ];
	const VA = {
		...yTrace('y3', selectedVA, `${selectedVA.name} ${titleSuffix}`),
		mode: 'lines+markers',
		hovertemplate: selectedVA.name + ': %{y}<br>%{x}',
		line: dataLine(colorSeries[2]),
	};

	return [ offScale, CRT, VA ];
}

const build = {
	prebuild(){
		this.toolBar = toolBar.linkToLayout(this);
		this.toolBar.allowUserToChangeHoverMode();
	},

	setSelectableUnits( selectableUnits ){
		this.toolBar.allowUserToSelectUnits(selectableUnits);
	},

	buildLayout( layoutData ){
		this.storeLayoutDataForThemeRebuild( layoutData );
		/**
		 * Axes
		 * Domain allocation for sub-plot layout: (note: 0 - 1, 0 being the bottom)
		 * e.g. sub-plotting within plot.ly - Navigator is outside this
		 * 0.06 gap between sub-plots:
		 */
		const domainLayout = [
			[ 0, 0.15 ], // Off-scale: CF, HM, PL, NPL
			[ 0.2, 1 ],
		];

		/**
		 * Axes for layout
		 */
		const x1 = getAxis({
			type: 'x',
			numTicks: 10,
			useDates: true,
			spikes: true,
			noMirrorLines: true,
		});

		// Off-scale
		const y1 = getAxis({
			type: 'y',
			domain: domainLayout[0],
			useCategories: {
				showAll: true,
				categoryarray: [ "NPL", "PL", "HM", "CF" ]
			},
			spikes: true,
		});

		// CRT
		const y2 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: layoutData.yaxis.y2.title,
			range: layoutData.yaxis.y2.range,
			spikes: true,
		});

		/**
		 * Dynamic selectable unit Y axis
		 * VA units used can be changed by the User
		 */
		const { name: unitName, range: unitRange } = this.toolBar.getSelectedUnitNameRange();
		const y3 = getAxis(
			Object.assign({
				type: 'y',
				title: `VA - ${unitName}`,
				domain: domainLayout[1],
				rightSide: 'y2',
				spikes: true,
			}, getAxisTypeForRange(unitRange))
		)

		/** plotly layout **/
		this.layout = getLayout({
			legend: true,
			xaxis: x1,
			yaxes: [ y1, y2, y3 ],
			rangeSlider: true,
			hovermode: this.toolBar.getHoverMode()
		});
	},

	buildData( plotData ){
		this.storePlotDataForThemeRebuild( plotData );
		/**
		 * Data - single plot so combine all the traces
		 */
		let data = [];

		let eyeTraces = new Map([
			[ 'R', 'rightEye' ],
			[ 'L', 'leftEye' ],
			[ 'BEO', 'BEO' ],
		]);

		eyeTraces.forEach(( eyeData, eye ) => {
			if ( plotData.hasOwnProperty(eyeData) ){

				const traces = buildDataTraces(
					plotData[eyeData],
					colors.getColorSeries(`${eyeData}Series`),
					`(${eye})`,
					this.toolBar.getSelectedUnit()
				);

				data = data.concat(traces)
			}
		});

		/** plotly data **/
		this.data = data;
	}

}


export const eyesOutcomes_offScale_selectableVA = { ...core, ...build};
