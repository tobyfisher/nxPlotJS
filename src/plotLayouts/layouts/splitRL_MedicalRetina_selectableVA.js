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

		this.listenForViewLayoutChange();
		this.procedureVericalHeight = 0.64 // DomainLayout[1][1]
	},

	setSelectableUnits( selectableUnits ){
		this.toolBar.allowUserToSelectUnits(selectableUnits);
	},

	buildLayout( layoutData ){
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
			yaxes: [ y1, y2, y3, y4 ],
			subplot: domainLayout.length, // num of sub-plots
			rangeSlider: true,
			dateRangeButtons: true,
			hovermode: this.toolBar.getHoverMode()
		});
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

		const selectedVA = eye.VA.units[ this.toolBar.getSelectedUnit() ];
		const VA = {
			...yTrace('y3', selectedVA, `${selectedVA.name}`),
			mode: 'lines+markers',
			hovertemplate: selectedVA.name + ': %{y}<br>%{x}'
		}

		const dataForSide = [ offScale, CRT, VA ];

		Object.values(eye.events).forEach(( event ) => {
			/**
			 * Events
			 * Event data are all individual traces
			 * all the Y values are the SAME to be shown on a line
			 * extra data for the popup can be passed in with customdata
			 */
			dataForSide.push({
				oeEventType: event.event, // store event type
				...yTrace('y4', event, event.name),
				...eventStyle(event.event),
				customdata: event.customdata,
				hovertemplate: event.customdata ?
					'%{y}<br>%{customdata}<br>%{x}<extra></extra>' : '%{y}<br>%{x}<extra></extra>',
				showlegend: false
			});
		});

		return dataForSide;
	}
};

export const splitRL_MedicalRetina_selectableVA = { ...splitCore, ...build };