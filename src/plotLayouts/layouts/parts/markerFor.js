import * as debug from "debug";
/**
 * return settings for "marker" style in data
 * @param {String} Event type: "Drugs", etc
 * @returns {Object}
 */
export const markerFor = ( type ) => {
	let symbol, size;

	switch ( type ){
		case 'management':
			symbol = "square";
			size = 9;
			break;
		case 'image':
			symbol = "triangle-down";
			size = 11;
			break;
		case 'drug':
			symbol = "diamond";
			size = 9;
			break;
		case 'injection':
			symbol = "star-diamond";
			size = 10;
			break;
		default :
			debug.error('markerFor', `Unknown marker type: ${ type }`);

	}

	return { symbol, size };
};