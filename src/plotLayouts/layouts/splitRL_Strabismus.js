import * as helpers from "../../helpers";
import { getAxis } from "../../getAxis";
import { getLayout } from "../../getLayout";
import { toolBar } from "../../toolBar";
import { splitCore } from "../splitCore";
import * as debug from "../../debug";
import { getAxisTypeForRange } from "../../getAxisTypeForRange";
import { dashedLine, dataLine } from "./parts/lines";
import { eventStyle } from "./parts/eventStyle";
import { yTrace } from "./parts/yTrace";
import * as colors from "../../colors";

/**
 * OES(Summary) Strabismus
 * 2 Individual Plots: Right Eye AND Left Eye
 * Sub-plot data layout
 * |- Events: Rx, Occlusion, etc
 * |- VA (logMAR only)
 * |- [Navigator]
 */

const build = {
	prebuild(){
		this.toolBar = toolBar.linkToLayout(this);
		this.toolBar.allowUserToChangeHoverMode();
		this.procedureVericalHeight = 0.64 // DomainLayout[1][1]
	},

	buildLayout( layoutData ){
		this.storeLayoutDataForRebuild(layoutData);
		/**
		 * Axes
		 * Domain allocation for sub-plot layout: (note: 0 - 1, 0 being the bottom)
		 * e.g. sub-plotting within plot.ly - Navigator is outside this
		 * use a 0.06 gap between sub-plots:
		 */
		const domainLayout = [
			[ 0.7, 1 ], 	// Events	y2
			[ 0, 0.64 ]	    // VA		y1
		];

		// VA
		const y1 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: layoutData.yaxis.y1.title,
			customTicks: layoutData.yaxis.y1.customTicks,
			spikes: true
		});

		// y2 - Events
		const y2 = getAxis({
			type: 'y',
			domain: domainLayout[0],
			useCategories: {
				categoryarray: layoutData.allEvents,
				rangeFit: "pad", // "exact", etc
			},
			spikes: true,
		});

		/**
		 * set up base layout for both plots
		 */
		this.setBaseLayoutForPlots({
			legend: { y: domainLayout[1][1] }, // position relative to subplots
			yaxes: [ y1, y2 ],
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

		// VA fixed in LogMAR from Strabismus
		const VA = {
			...yTrace('y1', eye.VA.units.logMAR, eye.VA.units.logMAR.name),
			mode: 'lines+markers',
			hovertemplate: '%{y}<br>%{x}'
		}

		// sometimes Strab has 3 recording for the VA (because they are kids and don't co-operate I guess)
		const all = {
			...yTrace('y1', eye.all, eye.all.name),
			mode: 'markers',
			hovertemplate: '%{y}<br>%{x}'
		}

		// BEO is used before single eye test on young children
		const BEO = {
			...yTrace('y1', eye.BEO.VA.units.logMAR, eye.BEO.VA.units.logMAR.name),
			mode: 'lines+markers',
			hovertemplate: '%{y}<br>%{x}',
			line: dataLine( colors.getColor(`BEO`), true)
		}

		return [ VA, BEO, all, ...this.buildEvents(eye.events, 'y2') ]
	}
};

export const splitRL_Strabismus = { ...splitCore, ...build };