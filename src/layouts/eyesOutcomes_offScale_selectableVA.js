import * as colors from "../colors";
import * as helpers from "../helpers";
import { getAxis } from "../getAxis";
import { getSelectableAxis } from "../getSelectableAxis";
import { getLayout } from "../getLayout";
import { toolBar } from "../toolBar";

export const eyesOutcomes_offScale_selectableVA = {
	plot: new Map(),

	/**
	 * init from JSON
	 * @param oePlotData {Object | Boolean} - agreed data structure passed in from DOM or false on theme change
	 */
	init( oePlotData, divID ){
		// first time store the raw oe data passed in from DOM
		this.raw = oePlotData;
		this.div = document.getElementById(divID);

		/**
		 * Summary toolBar exposes some of plotly API to User
		 * by adding a fixed toolbar DOM to the page.
		 */
		toolBar.setup(this);
		toolBar.showHoverMode(); // user hoverMode options for labels
		toolBar.showSelectableUnits(this.raw.yaxis.selectableUnits, 'Select VA scale');

		/**
		 * Plot Plotly
		 */
		this.buildPlotly();

		/**
		 * Users changes the theme, re-initialise to re-draw with correct colours
		 */
		document.addEventListener('oeThemeChange', () => {
			this.buildPlotly(false);
		});
	},

	/**
	 * Build or re-build plotly (if there is a theme change)
	 * if there is a theme change then completely rebuild, this is easier (more reliable)
	 * than trying to individually go through all the API and changing specific colours
	 */
	buildPlotly(){
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
				categoryarray: this.raw.yaxis.offScale.reverse()
			},
			spikes: true,
		});

		// CRT
		const y2 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: 'CRT',
			range: [ 200, 650 ], // hard coded range
			spikes: true,
		});

		/**
		 * Dynamic axis - VA units used depends on selected unit in toolBar
		 */
		let y3 = getSelectableAxis(
			this.raw.yaxis.selectableUnits,
			toolBar.selectedUnit,
			domainLayout[1],
			'VA - '
		);

		/**
		 * Layout
		 */
		const layout = getLayout({
			legend: true,
			xaxis: x1,
			yaxes: [ y1, y2, y3 ],
			rangeSlider: true,
		});

		// check toolBar for User selected hoverMode
		layout.hovermode = toolBar.hoverMode;

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
			data = data.concat(this.buildDataTraces(
				this.raw[eyeData],
				colors.getColorSeries(`${eyeData}Series`),
				`(${eye})`
			));
		});

		/**
		 * Plotly React, plot and re-build onThemeChange
		 */
		Plotly.react(
			this.div,
			data,
			layout,
			{ displayModeBar: false, responsive: true }
		);
	},

	/**
	 * Build data traces
	 */
	buildDataTraces( eye, colorSeries, titleSuffix ){

		const data = [];

		data.push({
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
		});

		data.push({
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
		});

		/**
		 * VA trace depends on the User selected unit
		 */
		const unitTraceData = eye.VA.units[toolBar.selectedUnit];
		data.push({
			x: unitTraceData.x,
			y: unitTraceData.y,
			name: `${unitTraceData.name} ${titleSuffix}`,
			yaxis: 'y3',
			hovertemplate: unitTraceData.name + ': %{y}<br>%{x}',
			type: 'scatter',
			mode: 'lines+markers',
			line: helpers.dataLine({
				color: colorSeries[2]
			}),
		});

		return data;
	}
};
