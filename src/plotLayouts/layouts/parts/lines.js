/**
 * return settings for dashed "line" style in data
 * @returns {Object}
 */
const dashedLine = () => ({
	dash: "2px,2px",
	width: 2,
});
/**
 * return setting for line in data
 * when multiple Eye data traces are added to a single plot they need to style themselves
 * @params {Object} args
 * @returns {Object} 'line'
 */
const dataLine = ( lineColor = false, isDashed = false) => {
	let line = isDashed ? dashedLine() : {};
	if( lineColor ) line.color = lineColor;
	return line;
};

export { dashedLine, dataLine }