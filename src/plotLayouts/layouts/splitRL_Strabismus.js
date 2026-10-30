import { getAxis } from "../../getAxis";
import { toolBar } from "../../toolBar";
import { splitCore } from "../splitCore";
import { yTrace } from "./parts/yTrace";
import { getLegend } from "../../getLegend";
import { customTraceLine, dataLine } from "./parts/lines";
import * as colors from "../../colors";
import { buildEvents, calcEventLayout, eventAxis } from "./parts/event";
import { convertDomain } from "./parts/domain";
import { getSplitColors } from "../../colors";

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
	},

	buildLayout( layoutData ){
		this.storeLayoutDataForRebuild(layoutData);
		/**
		 * Axes
		 * Domain allocation for sub-plot layout: (note: 0 - 1, 0 being the bottom)
		 * e.g. sub-plotting within plot.ly - Navigator is outside this
		 * use a 0.06 gap between sub-plots:
		 */

		const eventDomainHeight = calcEventLayout(layoutData.allEvents.length);

		// Events	y2
		// VA		y1

		const domainLayout = [
			convertDomain([ 100-eventDomainHeight, 100 ]),
			convertDomain([ 0, 90-eventDomainHeight])
		];

		this.procedureVericalHeight = domainLayout[1][1];

		// VA
		const y1 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			range: layoutData.yaxis.y1.range,
			title: layoutData.yaxis.y1.title,
			spikes: true
		});

		// Events
		const y2 = eventAxis( domainLayout[0], layoutData.allEvents )
		this.addEventAnnotations(layoutData.allEvents, 'y2');

		/**
		 * set up base layout for both plots
		 */
		this.setBaseLayoutForSplitPlots({
			legend:  getLegend.horizontal('bottom', domainLayout[1][1]), // position relative to subplots
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
	buildSideDataTraces( eye, side ){

		const sideSpecificColours = getSplitColors(side)

		// VA fixed in LogMAR from Strabismus
		const VA = {
			...yTrace('y1', eye.VA, eye.VA.name),
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
			...yTrace('y1', eye.BEO, eye.BEO.name),
			mode: 'lines+markers',
			hovertemplate: '%{y}<br>%{x}',
			line: customTraceLine( { color: colors.getColor(`BEO`), dashed: true }),
		}

		return [ VA, BEO, all, ...buildEvents(eye.events, 'y2', sideSpecificColours) ]
	}
};

export const splitRL_Strabismus = { ...splitCore, ...build };