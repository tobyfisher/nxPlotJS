/**
 * <div> with className, shortcut as such  common pattern
 * @param {String} className
 * @param {String} html
 * @returns {Element} <div>
 */
export const buildDiv = ( className, html = false ) => {
	const div = document.createElement('div');
	div.className = className;
	if ( html ) div.innerHTML = html;
	return div;
};