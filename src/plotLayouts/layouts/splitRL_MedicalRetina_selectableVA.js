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
	setup( options ){
		toolBar.linkToPlot(this);
		toolBar.allowUserToChangeHoverMode();

		this.listenForViewLayoutChange();
		this.procedureVericalHeight = 0.64 // DomainLayout[1][1]
	},

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

		const VA = selectableVA(eye.VA.units);

		const dataForSide = [ offScale, CRT, VA ];

		/**
		 * Events
		 * Event data are all individual traces
		 * all the Y values are are the SAME, so that are shown on a line
		 * extra data for the popup can be passed in with customdata
		 */
		Object.values(eye.events).forEach(( event ) => {
			dataForSide.push({
				oeEventType: event.event, // store event type
				...yTrace('y4', event, event.name),
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
			[ 0.7, 1 ], 	// Events		y4
			[ 0.15, 0.64 ],	// CRT | VA		y2 | y3
			[ 0, 0.15 ],	// Offscale		y1 (y)
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
		this.baseLayoutOptions = {
			legend: {
				yanchor: 'bottom',
				y: domainLayout[1][1], // position relative to subplots
			},
			xaxis: x1,
			yaxes: [ y1, y2, y3, y4 ],
			subplot: domainLayout.length, // num of sub-plots
			rangeSlider: true,
			dateRangeButtons: true,
			hovermode: toolBar.hoverMode
		};
	}
};

export const splitRL_MedicalRetina_selectableVA = { ...splitCore, ...build };