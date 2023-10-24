import { getAxis } from "../getAxis";
import { getLayout } from "../getLayout";
import { addLayoutHorizontals, addLayoutVerticals } from "../layoutAnnotations";
import { toolBar } from "../toolBar";
import * as helpers from "../helpers";
import { splitPlots } from "./splitPlots";
import * as debug from "../debug";
import { getAxisTypeForRange } from "../getAxisTypeForRange";

/**
 * OES(Summary) Adherence template
 * 2 Individual Plots: Right Eye AND Left Eye
 * Sub-plot data layout
 * |- Events: Injection, Images (OCT), Management (Inj Mgmt & Clinical Mgmt)
 * |- 24hr plots of drug application
 * |- [Navigator]
 */
const splitRL_Glaucoma_selectableVA = Object.create(splitPlots);
/**
 * Options could be exposed in API, currently it's all preset
 * @param options
 */
splitRL_Glaucoma_selectableVA.setup = function ( options ){
	toolBar.linkToPlot(this);
	toolBar.allowUserToChangeHoverMode();

	this.listenForViewLayoutChange();
}

const selectableVA = ( selectedVA ) => {
	return {
		yaxis: 'y3',
		x: selectedVA.x,
		y: selectedVA.y,
		name: `${selectedVA.name}`,
		hovertemplate: selectedVA.name + ': %{y}<br>%{x}',
		type: 'scatter',
		mode: 'lines+markers'
	};
}

splitRL_Glaucoma_selectableVA.buildDataTraces = function( eye ){

	const offScale = {
		yaxis: 'y1', // y1 = y = default
		x: eye.VA.offScale.x,
		y: eye.VA.offScale.y,
		name: `${eye.VA.offScale.name}`,
		hovertemplate: '%{y}<br>%{x}',
		type: 'scatter',
		mode: 'lines+markers'
	};

	const VFI = {
		yaxis: 'y2',
		x: eye.VFI.x,
		y: eye.VFI.y,
		name: eye.VFI.name,
		hovertemplate: '%{y}<br>%{x}<extra></extra>',
		type: 'scatter',
		mode: 'lines+markers',
		line: helpers.dashedLine(),
	};

	const IOP = {
		yaxis: 'y4',
		x: eye.IOP.x,
		y: eye.IOP.y,
		name: eye.IOP.name,
		hovertemplate: 'IOP: %{y}<br>%{x}<extra></extra>',
		type: 'scatter',
		mode: 'lines+markers',
	};

	/**
	 * VA trace depends on the User selected unit in the Toolbar
	 * units in VA must match the selectableKey set in the layout
	 */
	if ( eye.VA.units[toolBar.selectableKey] === undefined ){
		debug.error(`unable to find trace date for '${toolBar.selectableKey}'`);
	}

	const VA = selectableVA(eye.VA.units[toolBar.selectableKey]);

	const dataForSide = [ offScale, VFI, IOP, VA ];

	/**
	 * Events
	 * Event data are all individual traces
	 * all the Y values are are the SAME, so that are shown on a line
	 * extra data for the popup can be passed in with customdata
	 */
	Object.values(eye.events).forEach(( event ) => {
		dataForSide.push(
			Object.assign({
				yaxis: 'y5',
				oeEventType: event.event, // store event type
				x: event.x,
				y: event.y,
				customdata: event.customdata,
				name: event.name,
				hovertemplate: event.customdata ?
					'%{y}<br>%{customdata}<br>%{x}<extra></extra>' : '%{y}<br>%{x}<extra></extra>',
				type: 'scatter',
				showlegend: false,
			}, helpers.eventStyle(event.event))
		);
	});

	return dataForSide;
}

splitRL_Glaucoma_selectableVA.buildLayout = function ( layoutData ){
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
	this.baseLayoutOptions = {
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
	};
}

export { splitRL_Glaucoma_selectableVA }