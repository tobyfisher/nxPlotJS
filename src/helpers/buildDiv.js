/**
 * Build DIV
 * @param {String} hook - CSS hook for plot (just in case it's needed)
 * @returns {Element} <div>;
 */
export const buildDiv = ( hook, width = false ) => {
	const div = bj.div('oeplot-wrap');
	const cssHook = hook.replaceAll(' ', '-');
	div.classList.add(cssHook.toLowerCase());
	// force plotly to layout it's SVG container at the right width?
	if ( width ) div.style.width = width;
	return div;
};