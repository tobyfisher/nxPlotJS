import { markerFor} from "./markerFor";

/**
 * Consistent styling
 * @param {String} type - 'image', 'drug', 'injection'
 * @param {String | Boolean} color - if data is styling itself
 * @returns {Object}
 */
export const eventStyle = ( type, color = false ) => {
	const style = {
		marker: markerFor(type)
	};

	switch ( type ){
		case 'management':
		case 'image':
		case 'injection':
			style.mode = "markers";
			break;
		case 'drug':
			style.mode = "lines+markers";
			style.line = {
				width: 3,
			};
			break;
	}

	// add color, but preserve other properties
	if ( color ){
		if ( style.marker ) style.marker.color = color;
		if ( style.line ) style.line.color = color;
	}

	return style;
};