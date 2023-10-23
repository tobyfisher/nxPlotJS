import * as colors from "../colors";
import * as helpers from "../helpers";
import { getAxis } from "../getAxis";
import { getAxisTypeForRange } from "../getAxisTypeForRange";
import { getLayout } from "../getLayout";
import { toolBar } from "../toolBar";
import { corePlot } from "./corePlot";

const eyesOutcomes_offScale_selectableVA = Object.create(corePlot);

const selectableVA = ( selectedVA, color, titleSuffix ) => {
	return {
		x: selectedVA.x,
		y: selectedVA.y,
		name: `${selectedVA.name} ${titleSuffix}`,
		yaxis: 'y3',
		hovertemplate: selectedVA.name + ': %{y}<br>%{x}',
		type: 'scatter',
		mode: 'lines+markers',
		line: helpers.dataLine({
			color
		}),
	};
}

const buildDataTraces = ( eye, colorSeries, titleSuffix ) => {

	const offScale = {
		yaxis: 'y1', // y1 = y = default
		x: eye.VA.offScale.x,
		y: eye.VA.offScale.y,
		name: `${eye.VA.offScale.name} ${titleSuffix}`,
		hovertemplate: '%{y}<br>%{x}',
		type: 'scatter',
		mode: 'lines+markers',
		line: helpers.dataLine({
			color: colorSeries[0]
		}),
	};

	const CRT = {
		yaxis: 'y2',
		x: eye.CRT.x,
		y: eye.CRT.y,
		name: `${eye.CRT.name} ${titleSuffix}`,
		hovertemplate: 'CRT: %{y}<br>%{x}',
		type: 'scatter',
		mode: 'lines+markers',
		line: helpers.dataLine({
			color: colorSeries[1],
			dashed: true,
		}),
	};

	/**
	 * VA trace depends on the User selected unit in the Toolbar
	 */
	const VA = selectableVA(
		eye.VA.units[toolBar.selectableKey],
		colorSeries[2],
		titleSuffix
	);

	return [ offScale, CRT, VA ];
}

eyesOutcomes_offScale_selectableVA.buildLayout = function ( layoutData ){
	// store layout data for rebuilding on theme change
	if( !this.stored.has("layout" ) ){
		this.stored.set("layout", layoutData);
	}
	/**
	 * Axes
	 * Domain allocation for sub-plot layout: (note: 0 - 1, 0 being the bottom)
	 * e.g. sub-plotting within plot.ly - Navigator is outside this
	 * 0.06 gap between sub-plots:
	 */
	const domainLayout = [
		[ 0, 0.15 ], // Off-scale: CF, HM, PL, NPL
		[ 0.2, 1 ],
	];

	/**
	 * Axes for layout
	 */
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
		domain: domainLayout[0],
		useCategories: {
			showAll: true,
			categoryarray: [ "NPL", "PL", "HM", "CF" ]
		},
		spikes: true,
	});

	// CRT
	const y2 = getAxis({
		type: 'y',
		domain: domainLayout[1],
		title: layoutData.yaxis.y2.title,
		range: layoutData.yaxis.y2.range,
		spikes: true,
	});

	/**
	 * Select units MUST have the toolbar to change
	 * the VA units. Only need to set this up once
	 */
	if( this.hasToolBar === undefined ){
		toolBar.linkToPlot( this );
		toolBar.allowUserToChangeHoverMode();
		toolBar.allowUserToSelectUnits( layoutData.yaxis.selectableUnits, 'Select VA Units' );
		this.hasToolBar = true;
	}

	/**
	 * Dynamic selectable unit Y axis
	 * VA units used can be changed by the User
	 */
	const selectedUnit = toolBar.getSelectedUnit();

	const y3 = getAxis(
		Object.assign( {
			type: 'y',
			title: `VA - ${selectedUnit.name}`,
			domain: domainLayout[1],
			rightSide: 'y2',
			spikes: true,
		}, getAxisTypeForRange( selectedUnit.range ))
	)

	/**
	 * Layout
	 */
	this.layout = getLayout({
		legend: true,
		xaxis: x1,
		yaxes: [ y1, y2, y3 ],
		rangeSlider: true,
		hovermode: toolBar.hoverMode
	});
}

eyesOutcomes_offScale_selectableVA.buildData = function ( plotData ){
	// store layout data for rebuilding on theme change
	if ( !this.stored.has("plot") ){
		this.stored.set("plot", plotData);
	}

	/**
	 * Data - single plot so combine all the traces
	 */
	let data = [];

	let eyeTraces = new Map([
		[ 'R', 'rightEye' ],
		[ 'L', 'leftEye' ],
		[ 'BEO', 'BEO' ],
	]);

	eyeTraces.forEach(( eyeData, eye ) => {
		if ( plotData.hasOwnProperty(eyeData) ){

			const traces = buildDataTraces(
				plotData[eyeData],
				colors.getColorSeries(`${eyeData}Series`),
				`(${eye})`
			);

			data = data.concat(traces)
		}
	});

	this.data = data;
};

export { eyesOutcomes_offScale_selectableVA }
