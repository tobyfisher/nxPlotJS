const dashPattern = "2px,2px";

/**
 * return settings for dashed "line" style in data
 * @returns {Object}
 */
const dashedLine = () => ({
	dash: dashPattern,
	width: 2, // px
});
/**
 * return setting for line in data
 * when multiple Eye data traces are added to a single plot they need to style themselves
 * @params {Object} args
 * @returns {Object} 'line'
 */
const dataLine = ( lineColor = false, isDashed = false, width = 2 ) => {
	let line = { width }; // 2px
	if( lineColor ) line.color = lineColor;
	if( isDashed ) line.dash = dashPattern;
	return line;
};

/**
 * width: 2px
 * smoothing: 1 // 0 and 1.3
 */
const smoothLine = ( lineColor = false, isDashed = false, width = 2 ) => {
	let line = { shape: "spline", smoothing: 1, width };
	if( lineColor ) line.color = lineColor;
	if( isDashed ) line.dash = dashPattern;
	return line;
};

export { dashedLine, dataLine, smoothLine }