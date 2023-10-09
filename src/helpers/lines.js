/**
 * return settings for dashed "line" style in data
 * @returns {Object}
 */
const dashedLine = () => {
	return {
		dash: "2px,2px",
		width: 2,
	};
};
/**
 * return setting for line in data
 * when multiple Eye data traces are added to a single plot they need to style themselves
 * @params {Object} args
 * @returns {Object} 'line'
 */
const dataLine = ( args ) => {
	let line = {};
	if ( args.color ) line.color = args.color;
	if ( args.dashed ) line = Object.assign(line, dashedLine());
	return line;
};

export { dashedLine, dataLine }