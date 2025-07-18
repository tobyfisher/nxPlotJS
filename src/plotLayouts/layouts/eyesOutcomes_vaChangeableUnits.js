import * as colors from "../../colors";
import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { toolBar } from "../../toolBar";
import { core } from "../core";
import { dataLine } from "./parts/lines";
import { yTrace } from "./parts/yTrace";
import { getAxisTypeForRange } from "../../getAxisTypeForRange";

const build = {
	prebuild(){
		this.toolBar = toolBar.linkToLayout(this);
		this.toolBar.allowUserToChangeHoverMode();
	},

	setSelectableUnits( selectableUnits ){
		this.toolBar.allowUserToSelectUnits(selectableUnits);
		return this
	},

	buildLayout( layoutData ){
		this.storeLayoutDataForRebuild(layoutData);
		/**
		 * Axes
		 * Domain allocation for sub-plot layout: (note: 0 - 1, 0 being the bottom)
		 * e.g. sub-plotting within plot.ly - Navigator is outside this
		 * 0.06 gap between sub-plots:
		 */
		const domainLayout = [
			[ 0, 1 ],
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

		const y1 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: layoutData.yaxis.y1.title,
			range: layoutData.yaxis.y1.range,
			spikes: true,
		});

		/**
		 * Changeable VA units, selected by the User via toolbar (defaults to first in list)
		 */
		const { name: unitName, range: unitRange } = this.toolBar.getSelectedUnitNameRange();
		const y2 = getAxis(
			Object.assign({
				type: 'y',
				title: `VA - ${unitName}`,
				domain: domainLayout[0],
				rightSide: 'y1',
				spikes: true,
			}, getAxisTypeForRange(unitRange))
		);

		console.log( y2 );

		/** plotly layout **/
		this.layout = getLayout({
			legend: true,
			xaxis: x1,
			yaxes: [ y1, y2 ],
			rangeSlider: true,
			hovermode: this.toolBar.getHoverMode()
		});

		return this
	},

	buildData( plotData ){
		this.storePlotDataForThemeRebuild(plotData);
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

		const customTrace = ( plot, y, name, eye, lineColor, isDashed = false ) => ({
			...yTrace(y, plot, `${eye}: ${name} `),
			mode: 'lines+markers',
			hovertemplate: `${name}: %{y}<br>%{x}`,
			line: dataLine(lineColor, isDashed)
		});

		for ( const eyeType of Object.keys(eyeDataTypes) ){
			if ( plotData.hasOwnProperty(eyeType) ){
				const colorSeries = colors.getColorSeries(`${eyeType}Series`);
				const shortName = eyeDataTypes[eyeType];
				/**
				 * Changeable VA units, selected by the User via toolbar (defaults to first in list)
				 */
				const selectedVA = plotData[eyeType].VA.units[this.toolBar.getSelectedUnit()];

				data = data.concat([
					customTrace(plotData[eyeType].CRT, 'y1', 'CRT', shortName, colorSeries[0], true),
					customTrace(selectedVA, 'y2', 'VA', shortName, colorSeries[1])
				]);
			}
		}

		/** plotly data **/
		this.data = data;

		return this
	}

}

export const eyesOutcomes_vaChangeableUnits = { ...core, ...build };
