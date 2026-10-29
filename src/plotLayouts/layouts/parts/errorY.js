import { getColor } from "../../../colors";

export const errorY = ( { error_y } ) => ({
	type: 'data',
	array: error_y,
	visible: true,
	thickness: 1,
	width: 4,
	color: getColor("grey"),
});