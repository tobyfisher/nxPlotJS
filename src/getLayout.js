import * as colors from "./colors";
import { buttonStyling } from "./helpers/buttons";
import { fontWeight } from "./fonts";
import { isDarkTheme } from "./helpers/isDarkTheme";

/**
 * Build Plotly layout: colours and layout based on theme and standardized settings
 * @param {Object} options - quick reminder of 'options':
 * @returns {Object} layout themed for Plot.ly
 *
	Options:
	{
 		legend: false, 			// Optional {Boolean || Object} customise any of the defaults
		colors: 'standard', 	// Optional {String} (see colors.getColorSeries())
		plotTitle: false, 		// Optional {String}
		xaxis: x1,				// Required {Object} xaxis - see getAxis!
		yaxes: [ y1 ],			// Required {Array} all yaxes - see getAxis!
		subplot: false,			// Optional {Number} number of 'rows' (number of verical plots)
		vLineLabel: false		// Optional {Object} e.g. { x: [ ... ], h: 0.75 }
		hLineLabel: false		// Optional {Object} e.g. { y: [ ... ], axis: 'y2' }
		rangeslider: false,		// Optional {Boolean || Array} e.g. [firstDate, lastDate]
		dateRangeButtons: false // Optional {Boolean}
	}
 */
export const getLayout = function ( options ){
	// set up layout colours based on OE theme settings: "dark" or "light"
	const dark = isDarkTheme();

	// build the Plotly layout obj
	const layout = {
		isDark: dark, // store OE dark theme in layout
		autosize: true, // onResize change chart size
		margin: {
			l: 50, // 80 default, if Y axis has a title this will need more
			r: 50, // change if y2 axis is added (see below)
			t: 10, // if there is a title will need upping to 60
			b: 40, // allow for xaxis title
			pad: 4, // px between plotting area and the axis lines
			autoexpand: true, // auto margin expansion computations
		},
		// Paper = chart area. Set at opacity 0.5 for both, to hide the 'paper' set to: 0
		paper_bgcolor: colors.getColor('paper'),

		// actual plot area
		plot_bgcolor: colors.getColor('plot'),

		// base font settings
		font: {
			family: "Roboto, 'Open Sans', verdana, arial, sans-serif",
			size: 11,
			color: colors.getColor('label'),
			weight: fontWeight("light"),
		},

		// default set up for hoverlabels
		hoverlabel: {
			bgcolor: colors.getColor('max'),
			bordercolor: colors.getBlue('spike'),
			align: "left",
			font: {
				size: dark ? 10 : 11, // override base font
				color: colors.getBlue(),
				weight: fontWeight(),
			}
		},
		// Shapes and Annotations added through layoutAnnotations
		shapes: [],
		annotations: [],
		barmode: 'stack'
	};

	/*
	Customise hovermode
	*/
	if ( options.hasOwnProperty('hovermode') ){
		layout.hovermode = options.hovermode
	} else {
		layout.hovermode = 'closest'; // "x" | "y" | "closest" | false | "x unified" | "y unified"
	}

	/*
	Colour theme
	*/
	if ( options.hasOwnProperty('colors') ){
		layout.colorway = colors.getColorSeries(options.colors, dark);
	} else {
		layout.colorway = colors.getColorSeries("default", dark);
	}

	/*
	Plot title
	*/
	if ( options.hasOwnProperty('plotTitle') ){
		layout.title = {
			text: options.plotTitle,
			xref: 'paper', //  "container" | "paper" (as in, align too)
			yref: 'container',
			x: 0, // 0 - 1
			y: 1,
			yanchor: 'top',
			pad: {
				t: 10 // px gap from top
			},
			font: {
				size: 14,
				weight: fontWeight("light")
			},
		};
		// adjust the margin area
		layout.margin.t = 35;
	}

	/*
	Plot legend
	*/
	if ( options.hasOwnProperty('legend') ){
		layout.showlegend = true;
		layout.legend = options.legend;
	} else {
		layout.showlegend = false; // defaults to true otherwise
	}

	/*
	Subplots (n charts on a single plot)
	Assumes always vertically stacked
	*/
	if ( options.hasOwnProperty('subplot') ){
		layout.grid = {
			rows: options.subplot,
			columns: 1,
			pattern: 'coupled',
			xside: "bottom plot"
		};
	}

	/*
	X & Y Axes
	*/
	if ( options.hasOwnProperty('xaxis') ){
		layout.xaxis = options.xaxis; // only 1 axis per layout

		if ( layout.xaxis.title ){
			layout.margin.b = 80;
		}
	}

	if ( options.hasOwnProperty('yaxes') ){
		options.yaxes.forEach(( y, index ) => {
			if ( index ){
				layout['yaxis' + (index + 1)] = y;
			} else {
				layout.yaxis = y;
			}

			if ( y.title ){
				if ( y.side == 'right' ){
					layout.margin.r = 80; // make spare for Y on the right?
				} else {
					layout.margin.l = 80; // make space for Y title
				}
			}
		});
	}

	/*
	Add range slider to xaxis
	*/
	if ( options.hasOwnProperty('rangeSlider') ){

		const rangeslider = {
			thickness: 0.05
		};

		if ( dark ){
			// this is a pain. Plot.ly does not handles this well
			// can't find a setting to change the slide cover color!
			// it's set at a black opacity, so to make it usable...
			rangeslider.bgcolor = layout.paper_bgcolor;
			rangeslider.borderwidth = 1;
			rangeslider.bordercolor = layout.plot_bgcolor;
		}

		// if a date range has been set on the xaxis match it here
		if( options.xaxis.type === "date" && Array.isArray( options.xaxis.range)){
			rangeslider.range = options.xaxis.range;
		}




		// update layout:
		layout.xaxis.rangeslider = rangeslider;
		layout.margin.b = 15;
	}

	if ( options.hasOwnProperty('dateRangeButtons') ){
		layout.xaxis.rangeselector = Object.assign({
			x: 1,
			y: 1.02,
			xanchor: 'right',
			yanchor: 'bottom',
			buttons: [ {
				label: 'Show all',
				step: "all",
			}, {
				label: '5 Yr',
				step: "year",
				count: 5, // 1 = year, 2 = 2 years
			}, {
				label: '1 Yr',
				step: "year",
				count: 1, // 1 = year, 2 = 2 years
			}, {
				label: '6 Mth',
				step: "month",
				count: 6,
			}, {
				label: '1 Mth',
				step: "month",
				count: 1,
			} ]
		}, buttonStyling(dark));
	}

	if ( options.hasOwnProperty('barmode') ){
		layout.barmode = options.barmode;
	}

	// ok, all done
	return layout;
};
	
