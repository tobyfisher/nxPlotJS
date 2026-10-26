import { getAxis } from "../../getAxis";
import { toolBar } from "../../toolBar";
import { splitCore } from "../splitCore";
import { dashedLine } from "./parts/lines";
import { yTrace, yBars } from "./parts/yTrace";
import { getLegend } from "../../getLegend";

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
		const domainLayout = [
			[ 0.8, 1 ],	// Events		y4
			[ 0.42, 0.78 ],	// IOP			y3
			[ 0, 0.38 ]		// VFI | VA		y1 (y) | y2
		];


		const hasReports = false; // layoutData.hasOwnProperty('reports');
		let yR;

		if( hasReports){
			// update grid domain layout
			domainLayout[0] = [0.82, 0.86],
			domainLayout[3] = [0.88, 1]

			// new "y5" axis
			yR = {
				visible: false,
				showgrid: false,
				domain: domainLayout[3],
			};
		}

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
		const y4 = getAxis({
			type: 'y',
			domain: domainLayout[0],
			useCategories: {
				categoryarray: layoutData.allEvents,
				rangeFit: "pad", // "exact", etc
			},
			spikes: true,
			hideLabels: true,
			hideGridLines: true,
		});

		this.addEventAnnotations(layoutData.allEvents, 'y4');

		const yaxes = [y1, y2, y3, y4 ];
		if( hasReports ) {
			yaxes.push( yR );
		}

		/**
		 * set up base layout for both plots
		 */
		this.setBaseLayoutForSplitPlots({
			legend: getLegend.horizontal('bottom', domainLayout[2][1]), // position relative to subplots
			yaxes,
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

		const VA = {
			...yTrace('y2', eye.VA,  eye.VA.name),
			mode: 'lines+markers',
			hovertemplate: `${eye.VA.name}: %{y}<br>%{x}`
		}

		const IOP = {
			...yTrace('y3', eye.IOP, eye.IOP.name),
			mode: 'lines+markers',
			hovertemplate: 'IOP: %{y}<br>%{x}<extra></extra>',
		};

		const test = {
			yaxis: 'y4', // note: y1 = y = default
			base: 1262304000000,
			x: [31536000000],
			y: ['Generic Hylo Night eye ointment preservative free (No Preservative)'],
			xperiodalignment: "start",
			name: "test",
			type: 'bar',
			orientation: 'h',
			width: 0.8,
			showlegend: false,
			marker: {
				color: "#363",
				cornerradius: 3,
			},
			hovertemplate: '%{y}<br>%{x}<extra></extra>',
		};

		const test2 = {
			yaxis: 'y4', // note: y1 = y = default
			base: 1325376000000,
			x: [31536000000],
			y: ['Generic Hylo Night eye ointment preservative free (No Preservative)'],
			xperiodalignment: "start",
			name: "test",
			type: 'bar',
			orientation: 'h',
			showlegend: false,
			marker: {
				color: "#242",
			}
		};



		return [ VFI, IOP, VA, test, test2, ...this.buildEvents(eye.events, 'y4') ]
	}
}

export const splitRL_Glaucoma = { ...splitCore, ...build };