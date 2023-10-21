import { getBlue } from "./colors";

/**
 * Add vertical annotations to plotly
 * @param {*} layout - plotly layout object
 * @param {Array} verticals - e.g. [ { name: 'Over 14 days', x: 14 } ]
 * @param {Number} height - the height of the line (0 to 1)
 */
const addLayoutVerticals = ( layout, verticals, height ) => {
	if ( !Array.isArray(verticals) ) throw new Error('addLayoutVerticals - must be an Array');

	/**
	 * Map verticals against the templates:
	 */
	const line = ( { x } ) => {
		return {
			type: 'line',
			layer: 'above', // or "below"
			yref: 'paper', // this means y & y0 are ratios of area (paper)
			x0: x,
			y0: 0,
			x1: x,
			y1: height,
			line: {
				color: getBlue(),
				width: 0.5,
				//dash:"3px,4px,1px,4px,3px,1px",
			}
		};
	};
	const annotate = ( { name, x } ) => {
		return {
			showarrow: false,
			text: name,
			textangle: 90,
			align: "left",
			font: {
				color: getBlue()
			},
			borderpad: 2,
			x,
			xshift: 8, // shift over so label isnt' on line?
			yref: "paper", // this means y is ratio of area (paper)
			y: height
		};
	};

	/**
	 * build layout arrays
	 */
	layout.shapes = layout.shapes.concat(verticals.map(line));
	layout.annotations = layout.annotations.concat(verticals.map(annotate));
};

/**
 * Add vertical annotations to plotly
 * @param {*} layout - plotly layout object
 * @param {Array} horizontals - e.g. [ 'name' => 'Target IOP', 'y' => 15 ]
 * @param {String} yaxis - e.g. 'y3'
 */
const addLayoutHorizontals = ( layout, horizontals ) => {
	if ( !Array.isArray(horizontals) ) throw new Error('[oePlot] addLayoutVerticals - must be an Array');

	/**
	 * Map horizontals against the templates:
	 */
	const line = ( { y, yaxis } ) => {
		return {
			type: 'line',
			layer: 'below', // or "below"
			xref: "paper", // this means x & x0 are ratios of area (paper)
			yref: yaxis, // assign to a yaxis
			x0: 0,
			y0: y,
			x1: 1,
			y1: y,
			line: {
				color: getBlue(),
				width: 2,
				dash: "3px,12px",
			}
		};
	};

	const annotate = ( { name, y, yaxis } ) => {
		return {
			showarrow: false,
			text: name,
			align: "left",
			font: {
				color: getBlue()
			},
			borderpad: 2,
			xref: "paper",
			x: 0,
			yshift: 8, // shift over so label isn't too close to the axis
			yref: yaxis, // assign to the yaxis
			y: y
		};
	};

	/**
	 * build layout arrays
	 */
	layout.shapes = layout.shapes.concat(horizontals.map(line));
	layout.annotations = layout.annotations.concat(horizontals.map(annotate));
};

export { addLayoutVerticals, addLayoutHorizontals }
