import { getBlue, getColor } from "../colors";

/**
 * update layout shapes and annotations
 */
const buildLayoutShapesAnnotations = ( layout, arr, buildLine, buildAnnotate ) => {
	layout.shapes = layout.shapes.concat(arr.map(buildLine));
	layout.annotations = layout.annotations.concat(arr.map(buildAnnotate));
}

/**
 * base for annotations
 */
const annotateBase = {
	showarrow: false,
	align: "left",
};

/**
 * Add vertical annotations to plotly
 * @param {*} layout - plotly layout object
 * @param {Array} verticals - e.g. [ { name: 'Over 14 days', x: 14 } ]
 * @param {Number} height - the height of the line (0 to 1)
 */
const addLayoutVerticals = ( layout, verticals, height ) => {

	const line = ( { x } ) => ({
		type: 'line',
		layer: 'above', // or "below"
		yref: 'paper', // this means y & y0 are ratios of area (paper)
		x0: x,
		y0: 0,
		x1: x,
		y1: height,
		line: {
			color: getBlue(),
			width: 0.5
		}
	});

	const annotate = ( { name, x } ) => ({
		...annotateBase,
		font: { color: getBlue() },
		text: name,
		textangle: 90,
		x,
		xshift: 8, //  shift over so label isn't too close to the axis
		yref: "paper", // this means y is ratio of area (paper)
		y: height
	});

	buildLayoutShapesAnnotations(layout, verticals, line, annotate);
};

/**
 * Add vertical annotations to plotly
 * @param {*} layout - plotly layout object
 * @param {Array} horizontals - e.g. [ 'name' => 'Target IOP', 'y' => 15 ]
 * @param {String} yaxis - e.g. 'y3'
 */
const addLayoutHorizontals = ( layout, horizontals ) => {

	const line = ( { y, yaxis } ) => ({
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
			dash: "3px,18px",
		}
	});

	const annotate = ( { name, y, yaxis } ) => ({
		...annotateBase,
		font: { color: getBlue() },
		text: name,
		xref: "paper",
		x: 0,
		yshift: 8, // shift over so label isn't too close to the axis
		yref: yaxis, // assign to the yaxis
		y: y
	});

	buildLayoutShapesAnnotations(layout, horizontals, line, annotate);
};

/**
 * Add a grey text annotation instead of using a yaxis label (because drug names are so long)
 */
const annotateEventNames = ( events, yaxis, fontSize ) => {

	const annotate = ( name ) => ({
		...annotateBase,
		font: {
			color: getColor('label'),
			size: fontSize,
			weight: 500,
		},
		text: name,
		y: name,
		yref: yaxis, // assign to the yaxis
		yshift: 8, // shift up
		x: 0,
		xanchor: "left",
		xref: "paper",
		opacity: 0.8
	});

	return events.map(annotate);
}

export { addLayoutVerticals, addLayoutHorizontals, annotateEventNames };
