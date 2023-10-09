import * as debug from "debug";
/**
 * return settings for "marker" style in data
 * @param {String} Event type: "Drugs", etc
 * @returns {Object}
 */
export const markerFor = ( type ) => {
	const marker = {};

	switch ( type ){
		case 'management':
			marker.symbol = "square";
			marker.size = 9;
			break;
		case 'image':
			marker.symbol = "triangle-down";
			marker.size = 11;
			break;
		case 'drug':
			marker.symbol = "diamond";
			marker.size = 9;
			break;
		case 'injection':
			marker.symbol = "star-diamond";
			marker.size = 10;
			break;
		default :
			debug.error('markerFor', `Unknown marker type: ${ type }`);

	}

	return marker;
};