import { getAxis } from "../../getAxis";
import { toolBar } from "../../toolBar";
import { splitCore } from "../splitCore";
import { getAxisTypeForRange } from "../../getAxisTypeForRange";
import { dashedLine } from "./parts/lines";
import { yTrace } from "./parts/yTrace";

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
		this.procedureVericalHeight = 0.77 // DomainLayout[1][1]
	},

	setSelectableUnits( selectableUnits ){
		this.toolBar.allowUserToSelectUnits(selectableUnits);
		return this
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
			[ 0.82, 1 ],	// Events		y4
			[ 0.47, 0.77 ],	// IOP			y3
			[ 0, 0.42 ]		// VFI | VA		y1 (y) | y2
		];


		// VFI
		const y1 = getAxis({
			type: 'y',
			domain: domainLayout[2],
			title: layoutData.yaxis.y1.title,
			range: layoutData.yaxis.y1.range,
			spikes: true,
			maxAxisTicks: 12,
		});

		/**
		 * Changeable VA units, selected by the User via toolbar (defaults to first in list)
		 */
		const { name: unitName, range: unitRange } = this.toolBar.getSelectedUnitNameRange();
		const y2 = getAxis(
			Object.assign({
				type: 'y',
				title: `VA - ${unitName}`,
				domain: domainLayout[2],
				rightSide: 'y1',
				spikes: true,
			}, getAxisTypeForRange(unitRange))
		);

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

		const VFI = {
			...yTrace('y1', eye.VFI, eye.VFI.name),
			mode: 'lines+markers',
			hovertemplate: '%{y}<br>%{x}<extra></extra>',
			line: dashedLine(),
		};

		/**
		 * Changeable VA units, selected by the User via toolbar (defaults to first in list)
		 */
		const selectedVA = eye.VA.units[ this.toolBar.getSelectedUnit() ];
		const VA = {
			...yTrace('y2', selectedVA, `${selectedVA.name}`),
			mode: 'lines+markers',
			hovertemplate: selectedVA.name + ': %{y}<br>%{x}'
		}

		const IOP = {
			...yTrace('y3', eye.IOP, eye.IOP.name),
			mode: 'lines+markers',
			hovertemplate: 'IOP: %{y}<br>%{x}<extra></extra>',
		};


		return [ VFI, IOP, VA, ...this.buildEvents( eye.events, 'y4') ]
	}
}

export const splitRL_Glaucoma_vaChangeableUnits = { ...splitCore, ...build };