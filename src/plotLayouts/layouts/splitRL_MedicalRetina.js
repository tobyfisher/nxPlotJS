import { getAxis } from "../../getAxis";
import { toolBar } from "../../toolBar";
import { splitCore } from "../splitCore";
import { getAxisTypeForRange } from "../../getAxisTypeForRange";
import { dashedLine } from "./parts/lines";
import { yTrace } from "./parts/yTrace";
import { getLegend } from "../../getLegend";

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

	setSelectableUnits( { current, available } ){
		this.toolBar.allowUserToSelectUnits(current, available);
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
			[ 0.7, 1 ], 	// Events		y3
			[ 0, 0.64 ],	// CRT | VA		y1 | y2
		];

		// CRT
		const y1 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: layoutData.yaxis.y1.title,
			range: layoutData.yaxis.y1.range,
			spikes: true,
		});

		// VA
		const y2 = getAxis({
			type: 'y',
			title: layoutData.yaxis.y2.title,
			range: layoutData.yaxis.y2.range,
			domain: domainLayout[1],
			rightSide: 'y1',
			spikes: true,
		});

		// Events
		const y3 = getAxis({
			type: 'y',
			domain: domainLayout[0],
			useCategories: {
				categoryarray: layoutData.allEvents,
				rangeFit: "padTop", // "exact", etc
			},
			spikes: true,
			hideLabels: true,
		});

		this.addEventAnnotations(layoutData.allEvents, 'y3', 12);

		/**
		 * set up base layout for both plots
		 */
		this.setBaseLayoutForSplitPlots({
			legend: getLegend.horizontal('bottom', domainLayout[1][1]), // position relative to subplots
			yaxes: [ y1, y2, y3 ],
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

		const CRT = {
			...yTrace('y', eye.CRT, `${eye.CRT.name}`),
			mode: 'lines+markers',
			hovertemplate: 'CRT: %{y}<br>%{x}',
			line: dashedLine()
		};

		const VA = {
			...yTrace('y2', eye.VA, eye.VA.name),
			mode: 'lines+markers',
			hovertemplate: `${eye.VA.name}: %{y}<br>%{x}`
		}

		return [ CRT, VA, ...this.buildEvents(eye.events, 'y3') ]
	}
};

export const splitRL_MedicalRetina = { ...splitCore, ...build };