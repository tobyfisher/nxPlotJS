import * as colors from "../../colors";
import { getAxis } from "../../getAxis";
import { getAxisTypeForRange } from "../../getAxisTypeForRange";
import { getLayout } from "../../getLayout";
import { toolBar } from "../../toolBar";
import { core } from "../core";
import { dataLine } from "./parts/lines";
import { yTrace } from "./parts/yTrace";

const trace = ( plot, y, name, eye, lineColor, isDashed = false ) => ({
	...yTrace(y, plot, `${name} ${eye}`),
	mode: 'lines+markers',
	hovertemplate: `${name}: %{y}<br>%{x}`,
	line: dataLine(lineColor, isDashed)
});

const build = {
	prebuild(){
		this.toolBar = toolBar.linkToLayout(this);
		this.toolBar.allowUserToChangeHoverMode();
	},

	setSelectableUnits( selectableUnits ){
		this.toolBar.allowUserToSelectUnits(selectableUnits);
	},

	buildLayout( layoutData ){
		this.storeLayoutDataForRebuild( layoutData );
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
		let data = [];
		/**
		 * Data traces for Eyes
		 * it can handle 'R', 'L' and 'BEO' - all optional
		 * so, need to check what data is provided...
		 */
		const eyeDataTypes = {
			rightEye: 'R',
			leftEye: 'L',
			BEO: 'BEO'
		}

		for ( const eyeType of Object.keys(eyeDataTypes) ){
			if ( plotData.hasOwnProperty(eyeType) ){
				const colorSeries = colors.getColorSeries(`${eyeType}Series`);
				const shortName = eyeDataTypes[eyeType];
				const selectedVA = plotData[eyeType].VA.units[ this.toolBar.getSelectedUnit() ]; ;

				data = data.concat([
					trace(plotData[eyeType].VA.offScale, 'y1', 'VA', shortName, colorSeries[0]),
					trace(plotData[eyeType].CRT, 'y2', 'CRT', shortName, colorSeries[1], true),
					trace(selectedVA, 'y3', 'VA', shortName, colorSeries[2])
				]);
			}
		}

		/** plotly data **/
		this.data = data;
	}

}


export const eyesOutcomes_offScale_selectableVA = { ...core, ...build};
