import * as debug from "../../debug";
import * as helpers from "../../helpers";
import { getAxis } from "../../getAxis";
import { toolBar } from "../../toolBar";
import { splitCore } from "../splitCore";
import { getAxisTypeForRange } from "../../getAxisTypeForRange";
import { dashedLine } from "./parts/lines";
import { eventStyle } from "./parts/eventStyle";
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

const selectableVA = ( unitsForVA ) => {
	/**
	 * VA trace depends on the User selected unit in the Toolbar
	 * units in VA must match the selectableKey set in the layout
	 */
	const selectedVA = unitsForVA[toolBar.selectableKey];

	if ( selectedVA === undefined ){
		debug.error(`unable to find trace date for '${toolBar.selectableKey}'`);
		return false;
	}

	return {
		...yTrace('y3', selectedVA, `${selectedVA.name}`),
		mode: 'lines+markers',
		hovertemplate: selectedVA.name + ': %{y}<br>%{x}'
	};
}

const build = {

	prebuild(){
		toolBar.linkToPlot(this);
		toolBar.allowUserToChangeHoverMode();

		this.listenForViewLayoutChange();
		this.procedureVericalHeight = 0.77 // DomainLayout[1][1]
	},

	buildDataTraces( eye ){

		const offScale = {
			...yTrace('y1', eye.VA.offScale, `${eye.VA.offScale.name}`),
			mode: 'lines+markers',
			hovertemplate: '%{y}<br>%{x}'
		};

		const VFI = {
			...yTrace('y2', eye.VFI, eye.VFI.name),
			mode: 'lines+markers',
			hovertemplate: '%{y}<br>%{x}<extra></extra>',
			line: dashedLine(),
		};

		const IOP = {
			...yTrace('y4', eye.IOP, eye.IOP.name),
			mode: 'lines+markers',
			hovertemplate: 'IOP: %{y}<br>%{x}<extra></extra>',
		};

		const VA = selectableVA(eye.VA.units);

		const dataForSide = [ offScale, VFI, IOP, VA ];

		/**
		 * Events
		 * Event data are all individual traces
		 * all the Y values are are the SAME, so that are shown on a line
		 * extra data for the popup can be passed in with customdata
		 */
		Object.values(eye.events).forEach(( event ) => {
			dataForSide.push({
				oeEventType: event.event, // store event type
				...yTrace('y5', event, event.name),
				customdata: event.customdata,
				hovertemplate: event.customdata ?
					'%{y}<br>%{customdata}<br>%{x}<extra></extra>' : '%{y}<br>%{x}<extra></extra>',
				showlegend: false,
				...eventStyle(event.event)
			});
		});

		return dataForSide;
	},
	buildLayout( layoutData ){
		// Store for theme change, data and layout both need rebuilding
		this.stored.set('layout', layoutData);

		/**
		 * Axes
		 * Domain allocation for sub-plot layout: (note: 0 - 1, 0 being the bottom)
		 * e.g. sub-plotting within plot.ly - Navigator is outside this
		 * 0.06 gap between sub-plots:
		 */
		const domainLayout = [
			[ 0.82, 1 ],	// Events		y5
			[ 0.47, 0.77 ],	// IOP			y4
			[ 0.1, 0.42 ],	// VFI | VA		y2 | y3
			[ 0, 0.1 ],		// Offscale		y1 (y)
		];

		// timeline
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
			domain: domainLayout[3],
			useCategories: {
				categoryarray: [ "NPL", "PL", "HM", "CF" ],
				rangeFit: "padTop", // "exact", etc,
			},
			spikes: true,
		});

		// VFI
		const y2 = getAxis({
			type: 'y',
			domain: domainLayout[2],
			title: layoutData.yaxis.y2.title,
			range: layoutData.yaxis.y2.range,
			spikes: true,
			maxAxisTicks: 12,
		});

		// IOP
		const y4 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: layoutData.yaxis.y4.title,
			range: layoutData.yaxis.y4.range,
			maxAxisTicks: 12,
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
		});

		/**
		 * Dynamic selectable unit Y axis
		 * VA units used can be changed by the User
		 */
		const selectedUnit = toolBar.allowUserToSelectUnits(layoutData.yaxis.selectableUnits, 'Select VA Units');

		const y3 = getAxis(
			Object.assign({
				type: 'y',
				title: `VA - ${selectedUnit.name}`,
				domain: domainLayout[1],
				rightSide: 'y2',
				spikes: true,
			}, getAxisTypeForRange(selectedUnit.range))
		);

		/**
		 * Base options for Layout
		 * as the base options for getLayout are the same
		 * for R & L hold these and customise for each side
		 */
		this.setBaseLayoutForPlots({
			legend: {
				yanchor: 'bottom',
				y: domainLayout[1][1], // position relative to subplots
			},
			xaxis: x1,
			yaxes: [ y1, y2, y3, y4, y5 ],
			subplot: domainLayout.length, // num of sub-plots
			rangeSlider: true,
			dateRangeButtons: true,
			hovermode: toolBar.hoverMode
		});
	}
}

export const splitRL_Glaucoma_selectableVA = { ...splitCore, ...build };