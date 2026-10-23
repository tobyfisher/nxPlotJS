import { getBlue } from "../colors";

/**
 * Add vertical annotations to plotly
 * @param {*} layout - plotly layout object
 * @param {String} isoDate - the date to add the line at in ISO format "YYYY-MM-DD"
 **/
const addReportDateLine = ( layout, isoDate ) => {

	const line = {
		type: 'line',
		layer: 'above', // or "below"
		yref: 'paper', // this means y & y0 are ratios of area (paper)
		x0: isoDate,
		y0: 0,
		x1: isoDate,
		y1: 1,
		visible: false, // hide until requested with date
		line: {
			color: getBlue(),
			width: 2,
			dash: 'dot'
		}
	};

	/**
	 * To move the report date line the shape needs to be directly referenced
	 * in the shape array when using relayout
	 */
	let lineShapeArrayLength = layout.shapes.push( line );
	return lineShapeArrayLength - 1;
};

export { addReportDateLine }
