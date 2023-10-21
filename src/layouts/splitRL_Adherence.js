import { getAxis } from "../getAxis";
import { getLayout } from "../getLayout";
import { toolBar } from "../toolBar";
import * as helpers from "../helpers";

import { splitPlots } from "./splitPlots";

/**
 * OES(Summary) Adherence template
 * 2 Individual Plots for Right Eye AND Left Eye
 * Sub-plot data layout
 * |- Events: Injection, Images (OCT), Management (Inj Mgmt & Clinical Mgmt)
 * |- 24hr plots of drug application
 * |- [Navigator]
 */
const splitRL_Adherence = Object.create( splitPlots);

/**
 * Build data traces
 */
const buildDataTraces = ( eye ) => {

	/**
	 * Daily adherence will have the same Drug name as
	 * the Events, make sure they have unique Map Keys!
	 */
	const daily = {
		x: eye.daily.x,
		y: eye.daily.y,
		name: eye.daily.name,
		yaxis: 'y',	//  default is "y", not "y1"!!
		hovertemplate: `${eye.daily.name}: %{y}:00<extra></extra>`,
		type: 'scatter',
		mode: 'markers',
	};

	const dataForSide = [ daily ]

	/**
	 * Event data are all individual traces
	 * note: ALL the Y values are the SAME, to look like a horizontal bar
	 * extra data for the popup can be passed in with customdata
	 */
	Object.values(eye.events).forEach(( event ) => {

		const newEventTrace = Object.assign({
			oeEventType: event.event, // store event type
			x: event.x,
			y: event.y,
			customdata: event.customdata,
			name: event.name,
			yaxis: 'y2',
			hovertemplate: event.customdata ?
				'%{y}<br>%{customdata}<br>%{x}<extra></extra>' : '%{y}<br>%{x}<extra></extra>',
			type: 'scatter',
			showlegend: false,
		}, helpers.eventStyle(event.event));

		dataForSide.push(newEventTrace);
	});

	return dataForSide
}

splitRL_Adherence.buildPlot = function( eye, plotData ){
	const side = eye === 'R' ? 'right' : 'left';
	const plot = new Map();

	plot.set('div', document.querySelector(`.oes-${side}-side`));
	plot.set('data', buildDataTraces( plotData ));
	plot.set('layout', getLayout(
		Object.assign({
			colors: `${side}EyeSeries`,
			plotTitle: `${eye + side.substring(1)} eye`,
		}, this.layout)
	));

	plot.set('storedPlotData', plotData );

	this.plots.set(`${eye}`, plot );
}

splitRL_Adherence.buildRightData = function( plotData ){
	this.buildPlot('R', plotData);
}

splitRL_Adherence.buildLeftData = function( plotData ){
	this.buildPlot('L', plotData);
}

/**
 * Domain allocation for sub-plot layout: (note: 0 - 1, 0 being the bottom)
 * e.g. sub-plotting within plot.ly - Navigator is outside this
 * note: 0.06 gap between sub-plots:
 */
splitRL_Adherence.domainLayout = [
	[ 0.7, 1 ], // Events - y2
	[ 0, 0.64 ]	// 24hrs - y1 (y)
];

splitRL_Adherence.buildLayout = function ( layoutData ){

	const x1 = getAxis({
		type: 'x',
		numTicks: 10,
		useDates: true,
		spikes: true,
		noMirrorLines: true,
	});

	// Daily adherence
	const y1 = getAxis({
		type: 'y',
		domain: this.domainLayout[1],
		title: layoutData.yaxis.y1.title,
		range: layoutData.yaxis.y1.range,
		spikes: true,
	});

	// Events
	const y2 = getAxis({
		type: 'y',
		domain: this.domainLayout[0],
		useCategories: {
			categoryarray: layoutData.allEvents,
			rangeFit: "pad", // "exact", etc
		},
		spikes: true,
	});

	/**
	 * Base options for Layout
	 * as the base options for getLayout are the same
	 * for R & L hold these and customise for each side
	 */
	this.layout = {
		legend: {
			yanchor: 'bottom',
			y: this.domainLayout[1][1], // position relative to subplots
		},
		xaxis: x1,
		yaxes: [ y1, y2 ],
		subplot: splitRL_Adherence.domainLayout.length, // num of sub-plots
		rangeSlider: true,
		dateRangeButtons: true,
	};
}

splitRL_Adherence.showPlotToolbar = function(){
	/**
	 * Summary toolBar exposes some of plotly API to User
	 * by adding a fixed toolbar DOM to the page.
	 */
	toolBar.linkToPlot( this );
	toolBar.allowUserToChangeHoverMode();

	// check toolBar for User selected hoverMode
	this.layout.hovermode = toolBar.hoverMode;
}

export { splitRL_Adherence }