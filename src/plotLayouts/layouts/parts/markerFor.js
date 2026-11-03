import * as debug from "../../../debug";
import { getBlue } from "../../../colors";
/**
 * return settings for "marker" style in data
 * @returns {Object}
 * @param type {String}
 * @param many {Number}
 */
export const markerFor = ( type ) => {
	let symbol = "diamond"
	let size = 11;

	if( type === "report"){
		return {
			symbol:"diamond-open-dot",
			size,
			color: getBlue()
		}
	} else {
		switch ( type ){
			case 'management':
				symbol = "diamond";
				break;
			case 'drug':
			case 'drop':
				symbol = "circle";
				break;
			case 'injection':
				symbol = "star-diamond";
				break;
			default :
				debug.error(`markerFor: Unknown marker type: ${ type }`);

		}

		return { symbol, size  };
	}

};