import { getAxis } from "../../getAxis";
import { toolBar } from "../../toolBar";
import { splitCore } from "../splitCore";
import { yTrace } from "./parts/yTrace";
import { eventStyle } from "./parts/eventStyle";

/**
 * OES(Summary) Adherence template
 * 2 Individual Plots for Right Eye AND Left Eye
 * Sub-plot data layout
 * |- Events: Injection, Images (OCT), Management (Inj Mgmt & Clinical Mgmt)
 * |- 24hr plots of drug application
 * |- [Navigator]
 */

const build = {

	prebuild( ){
		this.toolBar = toolBar.linkToLayout(this);
		this.toolBar.allowUserToChangeHoverMode();
		this.listenForViewLayoutChange();
	},

	buildLayout( layoutData ){
		this.storeLayoutDataForRebuild( layoutData );
		/**
		 * Domain allocation for sub-plot layout: (note: 0 - 1, 0 being the bottom)
		 * e.g. sub-plotting within plot.ly - Navigator is outside this
		 * note: 0.06 gap between sub-plots:
		 */
		const domainLayout = [
			[ 0.7, 1 ], // Events - y2
			[ 0, 0.64 ]	// 24hrs - y1 (y)
		];

		// Daily adherence
		const y1 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: layoutData.yaxis.y1.title,
			range: layoutData.yaxis.y1.range,
			spikes: true,
		});

		// Events
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
		 * specific options for base layout
		 */
		this.setBaseLayoutForPlots({
			legend: { y: domainLayout[1][1] }, // position relative to subplots
			yaxes: [ y1, y2 ],
			subplot: domainLayout.length, // num of sub-plots
			hovermode: this.toolBar.getHoverMode()
		});
	},

	/**
	 * see: splitCore.js
	 * Data traces need to be built slightly differently
	 * for each eye side plot
	 * @param eye - plot data
	 */
	buildDataTraces( eye ){
		/**.
		 * Daily adherence will have the same Drug name as Events
		 */
		const dailyAdherence = {
			...yTrace('y', eye.daily, eye.daily.name),
			mode: 'markers',
			hovertemplate: `${eye.daily.name}: %{y}:00<extra></extra>`,
		};

		return [ dailyAdherence, ...this.buildEvents( eye.events, 'y2')]
	}
}

export const splitRL_Adherence = { ...splitCore, ...build };