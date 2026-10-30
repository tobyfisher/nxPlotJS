import { getBlue } from "../../../colors";

export const errorY = ( { error_y, color = undefined } ) => ({
	type: 'data',
	array: error_y,
	visible: true,
	thickness: 0.5,
	width: 3,
	color,
});