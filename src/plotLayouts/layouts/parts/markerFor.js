import * as debug from "../../../debug";
/**
 * return settings for "marker" style in data
 * @returns {Object}
 * @param type {String}
 * @param many {Number}
 */
export const markerFor = ( type ) => {
	let symbol = "diamond"
	let size = 12;

	switch ( type ){
		case 'management':
			symbol = "diamond";
			size = 11;
			break;
		case "report":
			symbol = "diamond-open-dot";
			size = 11;
			break;
		case 'image':
			symbol = "circle";
			size = 10;
			break;
		case 'drop':
			symbol = "circle";
			size = 11;
			break;
		case 'injection':
			symbol = "star-diamond";
			size = 11;
			break;
		default :
			debug.error(`markerFor: Unknown marker type: ${ type }`);

	}

	return { symbol, size  };
};