import * as debug from "debug";
import { customEvent } from "core";

/**
 * Custom Events
 * @param {String} eventType - "hover" or "click"
 * @param {Element} Plot DOM element
 * @param {String} eye side
 */
export const addEvent = ( eventType, div, eye ) => {
	if( eventType !== "click" || eventType !== "hover" ){
		debug.error("addEvent", `Wrong event type: ${ eventType }`);
	}
	div.on(`plotly_${eventType}`, function ( data ){
		const point = data.points[0];
		// pass back the JSON data relavant to the data clicked
		let obj = {
			eye,
			name: point.data.name,
			index: point.pointIndex,
			x: point.x,
			y: point.y
		};

		customEvent(`oePlot_${eventType}`, obj);
	});
}