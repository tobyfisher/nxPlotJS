import * as helpers from "../../helpers";
import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { toolBar } from "../../toolBar";
import { splitCore } from "../splitCore";
import * as debug from "../../debug";
import { getAxisTypeForRange } from "../../getAxisTypeForRange";
import { dashedLine } from "./parts/lines";
import { eventStyle } from "./parts/eventStyle";
import { yTrace } from "./parts/yTrace";

/**
 * OES(Summary) Med Retina
 * 2 Individual Plots: Right Eye AND Left Eye
 * Sub-plot data layout
 * |- Events: Images (OCT), Drugs, etc
 * |- CRT | VA
 * |- [Navigator]
 */

const build = {
	prebuild(){
		this.toolBar = toolBar.linkToLayout(this);
		this.toolBar.allowUserToChangeHoverMode();
		this.procedureVericalHeight = 0.64 // DomainLayout[1][1]
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
			[ 0.7, 1 ], 	// Events		y4
			[ 0.15, 0.64 ],	// CRT | VA		y2 | y3
			[ 0, 0.15 ],	// Offscale		y1 (y)
		];

		// Off-scale
		const y1 = getAxis({
			type: 'y',
			domain: domainLayout[2],
			useCategories: {
				categoryarray: [ "NPL", "PL", "HM", "CF" ],
				rangeFit: "padTop", // "exact", etc
			},
			spikes: true,
		});

		// Events
		const y2 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: layoutData.yaxis.y2.title,
			range: layoutData.yaxis.y2.range,
			spikes: true,
		});

		// y4 - Events
		const y4 = getAxis({
			type: 'y',
			domain: domainLayout[0],
			useCategories: {
				categoryarray: layoutData.allEvents,
				rangeFit: "pad", // "exact", etc
			},
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
		);

		/**
		 * set up base layout for both plots
		 */
		this.setBaseLayoutForPlots({
			legend: { y: domainLayout[1][1] }, // position relative to subplots
			yaxes: [ y1, y2, y3, y4 ],
			subplot: domainLayout.length, // num of sub-plots
			hovermode: this.toolBar.getHoverMode()
		});

		return this
	},

	/**
	 * see: splitCore.js
	 * Data traces need to be built slightly differently
	 * for each eye side plot
	 * @param eye - plot data
	 */
	buildDataTraces( eye ){

		const offScale = {
			...yTrace('y1', eye.VA.offScale, `${eye.VA.offScale.name}`),
			mode: 'lines+markers',
			hovertemplate: '%{y}<br>%{x}'
		};

		const CRT = {
			...yTrace('y2', eye.CRT, `${eye.CRT.name}`),
			mode: 'lines+markers',
			hovertemplate: 'CRT: %{y}<br>%{x}',
			line: dashedLine()
		};

		const selectedVA = eye.VA.units[this.toolBar.getSelectedUnit()];
		const VA = {
			...yTrace('y3', selectedVA, `${selectedVA.name}`),
			mode: 'lines+markers',
			hovertemplate: selectedVA.name + ': %{y}<br>%{x}'
		}

		return [ offScale, CRT, VA, ...this.buildEvents(eye.events, 'y4') ]
	}
};

export const splitRL_MedicalRetina_vaChangeableUnits = { ...splitCore, ...build };