import { getAxis } from "../../getAxis";
import { toolBar } from "../../toolBar";
import { splitCore } from "../splitCore";
import { getAxisTypeForRange } from "../../getAxisTypeForRange";
import { dashedLine, smoothLine } from "./parts/lines";
import { yTrace } from "./parts/yTrace";
import { getLegend } from "../../getLegend";
import { getBlue } from "../../colors";

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
			[ 0.82, 1 ], 	// Events		  y5
			[ 0.47, 0.78 ],	// CRT | VA		  y3 | y4
			[ 0, 0.43 ],	// Total Vol | %  y1 | y2
		];


		// Volumae
		const y1 = getAxis({
			type: 'y',
			domain: domainLayout[2],
			title: layoutData.yaxis.y1.title,
			range: layoutData.yaxis.y1.range,
			spikes: true,
		});

		// percentage change
		const y2 = getAxis({
			type: 'y',
			domain: domainLayout[2],
			title: layoutData.yaxis.y2.title,
			range: layoutData.yaxis.y2.range,
			rightSide: 'y1',
			spikes: true,
		});

		// CRT
		const y3 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: layoutData.yaxis.y3.title,
			range: layoutData.yaxis.y3.range,
			spikes: true,
		});

		// VA
		const y4 = getAxis({
			type: 'y',
			title: layoutData.yaxis.y4.title,
			range: layoutData.yaxis.y4.range,
			domain: domainLayout[1],
			rightSide: 'y3',
			spikes: true,
		});

		// Events
		const y5 = getAxis({
			type: 'y',
			domain: domainLayout[0],
			useCategories: {
				categoryarray: layoutData.allEvents,
				rangeFit: "pad", // "exact", etc
			},
			spikes: true,
			hideLabels: true,
		});

		this.addEventAnnotations(layoutData.allEvents, 'y5', 12);

		/**
		 * set up base layout for both plots
		 */
		this.setBaseLayoutForSplitPlots({
			legend: getLegend.horizontal('middle', domainLayout[1][1]), // position relative to subplots
			yaxes: [ y1, y2, y3, y4, y5 ],
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

		const volume = {
			...yTrace('y1', eye.volume, eye.volume.name),
			mode: 'lines+markers',
			hovertemplate: `${eye.volume.name}: %{y}<br>%{x}`
		}

		const change = {
			...yTrace('y2', eye.change, eye.change.name),
			mode: 'lines',
			hovertemplate: `${eye.change.name}: %{y}<br>%{x}`,
			line: smoothLine( getBlue(), true, 1 )
		}

		const CRT = {
			...yTrace('y3', eye.CRT, `${eye.CRT.name}`),
			mode: 'lines+markers',
			hovertemplate: 'CRT: %{y}<br>%{x}',
			line: dashedLine()
		};

		const VA = {
			...yTrace('y4', eye.VA, eye.VA.name),
			mode: 'lines+markers',
			hovertemplate: `${eye.VA.name}: %{y}<br>%{x}`
		}

		return [ volume, change, CRT, VA, ...this.buildEvents(eye.events, 'y5') ]
	}
};

export const splitRL_MedicalRetina = { ...splitCore, ...build };