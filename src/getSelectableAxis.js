import { getAxis } from "./getAxis";
import * as debug from "./debug";

/**
 * User selected units require the right Yaxis scale
 * @param selectableUnits {Object}
 * @param selected {String}
 * @param domainLayout {Array}
 * @param prefix {String}
 * @return {Object | boolean}
 */
export const getSelectableAxis = ( selectableUnits, selected, domainLayout, prefix = "" ) => {
	if ( selectableUnits.hasOwnProperty(selected) ){
		const selectedUnitAxis = selectableUnits[selected];

		let axis = {
			type: 'y',
			title: `${prefix}${selectedUnitAxis.name}`,
			domain: domainLayout,
			rightSide: 'y2',
			spikes: true,
		};

		/**
		 * Based on the unit range type build axis
		 * Could be a number range or categories
		 */
		if ( typeof selectedUnitAxis.range[0] === 'number' ){
			axis = getAxis(Object.assign(axis, {
				range: selectedUnitAxis.range, // e.g. [n1, n2];
				axisType: "linear", // set the axis.type explicitly here
			}));
		} else {
			axis = getAxis(Object.assign(axis, {
				useCategories: {
					showAll: true,
					categoryarray: selectedUnitAxis.range
				}
			}));
		}

		return axis;

	} else {
		debug.error(`Unknown selected unit: ${selected}`);
		return false;
	}
}

