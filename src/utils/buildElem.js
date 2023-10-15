/**
 * @param {String} domElement
 * @param {DOMString} html
 * @param {String | Boolean} className
 * @returns {Element} new Element
 */
export const buildElem = ( tagName, className = false, html = false ) => {
	const el = document.createElement(tagName);
	if ( className ) el.className = className;
	if ( html ) el.innerHTML = html;
	return el;
};