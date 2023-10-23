export const getAxisTypeForRange = ( range ) => {
	/**
	 * Based on the unit range type build axis
	 * Could be a number range or categories
	 */
	if ( typeof range[0] === 'number' ){
		return {
			range, // e.g. [n1, n2];
			axisType: "linear", // set the axis.type explicitly here
		};
	} else {
		return {
			useCategories: {
				showAll: true,
				categoryarray: range
			}
		};
	}
}

