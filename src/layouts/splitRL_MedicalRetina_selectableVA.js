import * as utils from "utils";
import * as colors from "../colors";
import { getAxis } from "../getAxis";
import { getLayout } from "../getLayout";
import { addLayoutHorizontals } from "../layoutAnnotations";
import { toolBar } from "../toolBar";
import * as helpers from "../helpers";

/**
 * OES(Summary) Adherence template
 * 2 Individual Plots: Right Eye AND Left Eye
 * Sub-plot data layout
 * |- Events: Injection, Images (OCT), Management (Inj Mgmt & Clinical Mgmt)
 * |- 24hr plots of drug application
 * |- [Navigator]
 */
export const splitRL_MedicalRetina_selectableVA = {
	plot: new Map(),

	/**
	 * init from JSON
	 * @param oePlotData {Object | Boolean} - agreed data structure passed in from DOM or false on theme change
	 */
	init( oePlotData ){
		// first time store the raw oe data passed in from DOM
		this.raw = oePlotData;

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
			this.buildPlotly();
		});

		/**
		 * User changes layout arrangement (top split view, etc)
		 */
		document.addEventListener('oesLayoutChange', () => {
			[ 'R', 'L' ].forEach(eye => {
				if ( this.plot.has(`${eye}`) ){
					Plotly.relayout(
						this.plot.get(`${eye}`).get('div'),
						this.plot.get(`${eye}`).get('layout')
					);
				}
			});
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
				categoryarray: this.raw.yaxis.offScale,
				rangeFit: "padTop", // "exact", etc
			},
			spikes: true,
		});

		// Events
		const y2 = getAxis({
			type: 'y',
			domain: domainLayout[1],
			title: 'CRT',
			range: this.raw.yaxis.CRT,
			spikes: true,
		});

		// y4 - Events
		const y4 = getAxis({
			type: 'y',
			domain: domainLayout[0],
			useCategories: {
				categoryarray: this.raw.allEvents,
				rangeFit: "pad", // "exact", etc
			},
			spikes: true,
		});

		/**
		 * Dynamic axis - VA units used depends on selected unit in toolBar
		 */

		// let y3 = getSelectableAxis(
		// 	this.raw.yaxis.selectableUnits,
		// 	toolBar.selectedUnit,
		// 	domainLayout[1],
		// 	'VA - '
		// );

		/**
		 * Data - Separate data for each side plot.
		 * Colours can be set on the layout
		 * onThemeChange only update the colour changes
		 */

		[ 'R', 'L' ].forEach(eye => {
			const full = eye === 'R' ? 'right' : 'left';

			// is there any data? (oePlotData will be false if re-initialising)
			if ( this.raw.hasOwnProperty(`${full}Eye`) && !this.plot.has(`${eye}`) ){
				const m = new Map();
				m.set('div', document.querySelector(`.oes-${full}-side`));
				this.plot.set(`${eye}`, m);
			}

			// set colours for plot side
			if ( this.plot.has(`${eye}`) ){
				const side = this.plot.get(`${eye}`);
				side.set('data', this.buildDataTraces(this.raw[`${full}Eye`]));
				side.set('layout', this.buildLayout(
					`${full[0].toUpperCase() + full.substring(1)} eye`,
					`${full}EyeSeries`,
					domainLayout,
					x1,
					[ y1, y2, y3, y4 ]
				));

				/**
				 * Plotly React, plot and re-build onThemeChange
				 */
				Plotly.react(
					side.get('div'),
					side.get('data'),
					side.get('layout'),
					{ displayModeBar: false, responsive: true }
				);
			}
		});
	},

	/**
	 *
	 * @param title {String}
	 * @param colors {String}
	 * @param domains {Array}
	 * @param x1 {object}
	 * @param yaxes {Array}
	 * @return layout
	 */
	buildLayout( title, colors, domains, x1, yaxes ){
		const layout = getLayout({
			legend: {
				yanchor: 'bottom',
				y: domains[1][1], // position relative to subplots
			},
			colors,
			plotTitle: title,
			xaxis: x1,
			yaxes,
			subplot: domains.length, // num of sub-plots
			rangeSlider: true,
			dateRangeButtons: true,
		});

		// check toolBar for User selected hoverMode
		layout.hovermode = toolBar.hoverMode;

		return layout;
	},

	/**
	 * Build data traces
	 */
	buildDataTraces( eye ){

		const data = [];

		data.push({
			yaxis: 'y1', // y1 = y = default
			x: eye.VA.offScale.x,
			y: eye.VA.offScale.y,
			name: `${eye.VA.offScale.name}`,
			hovertemplate: '%{y}<br>%{x}',
			type: 'scatter',
			mode: 'lines+markers'
		});

		data.push({
			yaxis: 'y2',
			x: eye.CRT.x,
			y: eye.CRT.y,
			name: `${eye.CRT.name}`,
			hovertemplate: 'CRT: %{y}<br>%{x}',
			type: 'scatter',
			mode: 'lines+markers',
			line: helpers.dashedLine()
		});

		/**
		 * VA trace depends on the User selected unit
		 */
		const unitTraceData = eye.VA.units[toolBar.selectedUnit];
		data.push({
			yaxis: 'y3',
			x: unitTraceData.x,
			y: unitTraceData.y,
			name: `${unitTraceData.name}`,
			hovertemplate: unitTraceData.name + ': %{y}<br>%{x}',
			type: 'scatter',
			mode: 'lines+markers'
		});

		/**
		 * Events
		 * Event data are all individual traces
		 * all the Y values are are the SAME, so that are shown on a line
		 * extra data for the popup can be passed in with customdata
		 */
		Object.values(eye.events).forEach(( event ) => {
			data.push(
				Object.assign({
					yaxis: 'y4',
					oeEventType: event.event, // store event type
					x: event.x,
					y: event.y,
					customdata: event.customdata,
					name: event.name,
					hovertemplate: event.customdata ? '%{y}<br>%{customdata}<br>%{x}<extra></extra>' : '%{y}<br>%{x}<extra></extra>',
					type: 'scatter',
					showlegend: false,
				}, helpers.eventStyle(event.event))
			);
		});

		return data;
	}
};