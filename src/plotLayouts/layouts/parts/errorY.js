import { getBlue } from "../../../colors";

export const errorY = ( { error_y, color = undefined } ) => ({
	type: 'data',
	array: error_y,
	visible: true,
	thickness: 1,
	width: 2,
	color,
});