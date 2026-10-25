import * as debug from "../../../debug";
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
			size = 10;
			break;
		case "report":
		case 'image':
			symbol = "circle";
			size = 11;
			break;
		case 'duration':
			symbol = "diamond";
			size = 6;
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