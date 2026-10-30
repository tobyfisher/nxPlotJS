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

	setSelectableUnits( { current, available } ){
		this.toolBar.allowUserToSelectUnits( current, available);
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

		// Events   	y4
		// IOP       	y3 [<-- key data]
		// VFI | VA		y1 (y) | y2

		const domainLayout = [
			convertDomain([ 100-eventDomainHeight, 100 ]),
			convertDomain([ 58, 96].map(x => x - eventDomainHeight)),
			convertDomain([ 0, 54-eventDomainHeight])
		];

		this.procedureVericalHeight = domainLayout[1][1];

		// VFI
		const y1 = getAxis({
			type: 'y',
			domain: domainLayout[2],
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
			domain: domainLayout[2],
			rightSide: 'y1',
			spikes: true,
		});

		// IOP
		const y3 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: layoutData.yaxis.y3.title,
			range: layoutData.yaxis.y3.range,
			maxAxisTicks: 12,
			spikes: true,
		});

		// Events
		const y4 = eventAxis( domainLayout[0], layoutData.allEvents )
		this.addEventAnnotations(layoutData.allEvents, 'y4');

		/**
		 * set up base layout for both plots
		 */
		this.setBaseLayoutForSplitPlots({
			legend: getLegend.horizontal('bottom', domainLayout[2][1]), // position relative to subplots
			yaxes: [y1, y2, y3, y4 ],
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

		const VFI = {
			...yTrace('y1', eye.VFI, eye.VFI.name),
			mode: 'lines+markers',
			hovertemplate: `%{y} <sup>${eye.VFI.name}</sup><br>%{x}<extra>VFI</extra>`,
			line: customTraceLine({ color: getColor('standard'), dashed: true }),
			zorder: 1,
		};

		const MD = {
			...yTrace('y1', eye.MD, eye.MD.name),
			mode: 'lines+markers',
			hovertemplate: `%{y} <sup>${eye.MD.name}</sup><br>%{x}<extra>MD</extra>`,
			line: customTraceLine({ color: getColor('orange') }),
			zorder: 1,
		};

		const VA = {
			...yTrace('y2', eye.VA,  eye.VA.name),
			mode: 'lines+markers',
			hovertemplate: `%{y} <sup>${eye.VA.name}</sup><br>%{x}<extra>VA</extra>`,
		}

		const IOP = {
			...yTrace('y3', eye.IOP, eye.IOP.name),
			mode: 'lines+markers',
			hovertemplate: 'IOP: %{y}<br>%{x}<extra></extra>',
			error_y: errorY(eye.IOP),
			line: customTraceLine({ color: getColor('primary') }),
		};

		return [ VA, VFI, MD, IOP, ...buildEvents(eye.events, 'y4', sideSpecificColours) ]
	}
}

export const splitRL_Glaucoma = { ...splitCore, ...build };