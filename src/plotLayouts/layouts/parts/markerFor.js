import * as debug from "../../../debug";
/**
 * return settings for "marker" style in data
 * @returns {Object}
 * @param type {String}
 * @param many {Number}
 */
export const markerFor = ( type ) => {
	let symbol = "circle"
	let size = 8;

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
		case 'drop':
			symbol = "diamond";
			size = 6;
			break;
		case 'injection':
			symbol = "star-diamond";
			size = 10;
			break;
		default :
			debug.error(`markerFor: Unknown marker type: ${ type }`);

	}

	return { symbol, size  };
};