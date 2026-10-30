import * as colors from "./colors";
import { isDarkTheme } from "./helpers/isDarkTheme";

/**
 * Build an axis object
 * @param {Object} options - optional options for Axis
 * @returns {Object} axis for layout
 *
	Options:
	{
		type: 'x' or 'y' 		// Required {String} axis 
		domain: false, 			// Optional {Array} e.g. [0, 0.75] (if subplot)
		title: false, 			// Optional {String}
		rightSide: false		// Options 	{String} - yAxis to overlay 'y'
		maxAxisTicks: false, 	// Optional {Number}
		useDates: false, 		// Options 	{Boolean}
		range: false, 			// Optional {Array} e.g. [0, 100]
		axisType: false			// Optional {String} 
		useCategories: 			// Optional {Object} e.g. { showAll:true, categoryarray:[] }
		spikes: false, 			// Optional {Boolean}
		noMirrorLines: false	// Optional {Boolean}
	}
 */
export const getAxis = function ( options ){
	// set up layout colours based on OE theme settings: "dark" or "light"
	const dark = isDarkTheme();

	// default
	let axis = {
		linecolor: dark ? '#666' : '#999', // axis line colour
		linewidth: 1,
		showgrid: true,
		gridcolor: colors.getAxisGridColor(),
		tickmode: "auto",
		tickfont: {
			size: 10,
		},
		nticks: 10, // max. # of ticks. Actual # of ticks auto to be less than or equal to `nticks`. `tickmode` must be set to "auto".
		ticks: "outside",
		ticklen: 3, // px
		tickcolor: colors.getAxisTickColor(),
		automargin: true, //  long tick labels automatically grow the figure margins.
		mirror: true, //  ( true | "ticks" | false | "all" | "allticks" )
		connectgaps: false, // this allows for 'null' value gaps!
	};

	// axis? x or y
	const isY = options.type === 'y';

	if ( options.type === 'x' ){
		axis.anchor = 'y'; // always anchored to y or y1
		// minallowed: '2025-01-01',
		// maxallowed: '2026-01-01'
	} else {
		axis.anchor = 'x';
	}

	// balance axis lines on other side of plot area
	if ( options.hasOwnProperty('noMirrorLines') ){
		axis.mirror = false;
	}

	// hide the grid lines for this axis
	if ( options.hasOwnProperty('hideGridLines') ){
		axis.showgrid = false;
	}

	// subplot?
	if ( options.hasOwnProperty('domain') && isY ){
		axis.domain = options.domain;
	}

	// add titles to Axes?
	if ( options.hasOwnProperty('title') ){
		axis.title = {
			text: options.title,
			standoff: isY ? 10 : 20, // px offset
			font: {
				size: 11,
			}
		};
	}

	// mirror Y axis (left one has priority)
	if ( options.hasOwnProperty('rightSide') && isY ){
		axis.overlaying = options.rightSide; // set to y1, y2, etc
		axis.side = 'right';
		axis.showgrid = false;
		axis.zeroline = false;
		axis.title.standoff = 15;
	}

	// axis range
	if ( options.hasOwnProperty('range') ){

		// as a range is set, it is assumed it is a fixed range
		axis.autorange = false;

		if ( Array.isArray(options.range) ){
			/**
			 * range sets the yAxis limits AND direction
			 */
			axis.range = options.range; // e.g [1,10] - the range for the axis

		} else {
			// or it's "custom" ticks:
			// range: {
			// 		vals: [0, 0.4, 0.8, 1.2, 1.6, 1.8, 2, 2.1, 2.2, 2.3],
			// 		text: [0, 0.4 ,0.8, 1.2, 1.6, "CF", "HM", "LP", "NLP"],
			// 		reverseRange: true
			// },

			axis.tickmode = "array"; // must be an array
			axis.tickvals = options.range.vals;
			axis.ticktext = options.range.text;

			const
				r0 = options.range.vals[0],
				rLast = options.range.vals.at(-1)

			/**
			 * range sets the yAxis limits AND direction
			 */
			if( options.range.reverseRange ){
				axis.range = [ rLast, r0 ];
			} else {
				axis.range = [ r0, rLast ];
			}
		}

	}

	// categories (e.g used for events)
	if ( options.hasOwnProperty('useCategories') ){
		let arr = options.useCategories.categoryarray;

		axis.type = "category";
		axis.categoryarray = arr;
		/*
		Category range. Each category is assigned a serial number from zero in the order it appears
		Using the "range" options I can "pad" the axis out or have fit the plot exactly
		*/
		if ( options.useCategories.rangeFit ){
			switch ( options.useCategories.rangeFit ){
				case "exact":
					axis.range = [ 0, arr.length - 1 ];
					break;
				case "pad":
					axis.range = [ -0.5, arr.length - 0.5 ];
					break;
				case "padTop":
					axis.range = [ -0.5, arr.length ];
					break;
			}
		}
	}

	// hide the event tick labels (as drug names are long!)
	if ( options.hasOwnProperty('hideLabels') ){
		axis.showticklabels = false;
	}

	// set nticks
	if ( options.hasOwnProperty('maxAxisTicks') ){
		axis.nticks = options.maxAxisTicks;
	}

	// use Dates? - OE data formatting
	if ( options.hasOwnProperty('useDates') ){

		// https://d3js.org/d3-time-format
		axis.tickformat = "%b %Y"; // Mth Y
		axis.type = "date"; // or plotly will try and figure it out

		if ( !isY ){
			// xaxis
			axis.tickfont.size = 11 // bump this up
			axis.autorange = true;
		}

		if( options.hasOwnProperty('dateRange')
			&& options.dateRange !== undefined  ){
			axis.range = [ options.dateRange.firstDate, options.dateRange.lastDate ];
			axis.autorange = false;
		}
	}

	// spikes
	if ( options.hasOwnProperty('spikes') ){
		axis.showspikes = true;
		axis.spikecolor = colors.getBlue('spike');
		axis.spikethickness = isDarkTheme() ? 0.5 : 1.5;
		axis.spikedash = isDarkTheme() ? "1px,3px" : "2px,3px";
		axis.spikemode = "across";
	}

	return axis;
};
