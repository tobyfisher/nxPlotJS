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
export const splitRL_Adherence = {
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
		toolBar.setup( this );
		toolBar.showHoverMode(); // user hoverMode options for labels

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
			[ 0.7, 1 ], // Events - y2
			[ 0, 0.64 ]	// 24hrs - y1 (y)
		];

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
			domain: domainLayout[1],
			title: '24 Hours',
			range: this.raw.yaxis.hours,
			spikes: true,
		});

		// Events
		const y2 = getAxis({
			type: 'y',
			domain: domainLayout[0],
			useCategories: {
				categoryarray: this.raw.allEvents,
				rangeFit: "pad", // "exact", etc
			},
			spikes: true,
		});

		/**
		 * Data - Separate data for each side plot.
		 * Colours for each eye trace have to be set on the data trace
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
					[ y1, y2 ]
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

		// add a dotted horizontal line on plot
		addLayoutHorizontals(layout, [ { 'name': 'Noon', 'y': 12 } ], 'y');

		// check toolBar for User selected hoverMode
		layout.hovermode = toolBar.hoverMode;

		return layout;
	},

	/**
	 * Build data traces
	 * @param {JSON} eyeJSON data
	 * @returns {Array} for Plol.ly data
	 */
	buildDataTraces( eye ){
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
		Event data are all individual traces
		note: ALL the Y values are the SAME, to look like a horizontal bar
		extra data for the popup can be passed in with customdata
		 */
		Object.values(eye.events).forEach(( event ) => {

			const newEventTrace = Object.assign({
				oeEventType: event.event, // store event type
				x: event.x,
				y: event.y,
				customdata: event.customdata,
				name: event.name,
				yaxis: 'y2',
				hovertemplate: event.customdata ? '%{y}<br>%{customdata}<br>%{x}<extra></extra>' : '%{y}<br>%{x}<extra></extra>',
				type: 'scatter',
				showlegend: false,
			}, helpers.eventStyle(event.event));

			dataForSide.push(newEventTrace);
		});

		return dataForSide
	}
};