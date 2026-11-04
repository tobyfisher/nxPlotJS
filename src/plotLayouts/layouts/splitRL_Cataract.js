import { getAxis } from "../../getAxis";
import { toolBar } from "../../toolBar";
import { splitCore } from "../splitCore";
import { customTraceLine } from "./parts/lines";
import { calcEventLayout, eventAxis, buildEvents } from "./parts/event";
import { yTrace } from "./parts/yTrace";
import { getLegend } from "../../getLegend";
import { convertDomain } from "./parts/domain";
import { getColor, getSplitColors } from "../../colors";
import { errorY } from "./parts/errorY";
import { annotateTest } from "../layoutAnnotations";

/**
 * OES(Summary) Glaucoma
 * 2 Individual Plots: Right Eye AND Left Eye
 * Sub-plot data layout
 * |- Events: Images (OCT), Drugs, etc
 * |- IOP
 * |- VFI | VA
 * |- [Navigator]
 */
const build = {

	prebuild(){
		this.toolBar = toolBar.linkToLayout(this);
		this.toolBar.allowUserToChangeHoverMode();
	},

	setChangeableUnits( units ){
		this.toolBar.allowUserToChangeUnits( units );
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

		const eventDomainHeight = calcEventLayout(layoutData.allEvents.length);

		// Events   	y3
		// VFI | VA		y1 (y) | y2

		const domainLayout = [
			convertDomain([ 100-eventDomainHeight, 100 ]),
			convertDomain([ 0, 92-eventDomainHeight])
		];

		this.procedureVericalHeight = domainLayout[1][1];

		// VFI
		const y1 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: layoutData.yaxis.y1.title,
			range: layoutData.yaxis.y1.range,
			spikes: true,
			maxAxisTicks: 12,
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
		const y3 = eventAxis( domainLayout[0], layoutData.allEvents )
		this.addEventAnnotations(layoutData.allEvents, 'y3');

		/**
		 * set up base layout for both plots
		 */
		this.setBaseLayoutForSplitPlots({
			legend: getLegend.horizontal('bottom', domainLayout[1][1]), // position relative to subplots
			yaxes: [y1, y2, y3  ],
			dateRange: layoutData.xaxis.dateRange,
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

		const VF = {
			...yTrace('y1', eye.VF, eye.VF.name),
			nxTrace: 'VF',
			mode: 'lines+markers',
			hovertemplate: `${eye.VF.name} %{y}<br>%{x}<extra>MD</extra>`,
			line: customTraceLine({ color: getColor('standard') }),
			zorder: 1,
		};

		const VA = {
			...yTrace('y2', eye.VA,  eye.VA.name),
			nxTrace: 'VA',
			mode: 'lines+markers',
			hovertemplate: `${eye.VA.name} %{y}<br>%{x}<extra>VA</extra>`,
		}


		return [ VA, VF, ...buildEvents(eye.events, 'y3', sideSpecificColours) ]
	}
}

export const splitRL_Cataract = { ...splitCore, ...build };