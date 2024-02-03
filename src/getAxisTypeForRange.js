const numberRange = ( range ) => ({
	range, // e.g. [n1, n2];
	axisType: "linear", // set the axis.type explicitly here
});

const categoryRange = ( range ) => ({
	useCategories: {
		showAll: true,
		categoryarray: range
	}
});

/**
 * Based on the unit range type build axis
 * Could be a number range or categories
 */
export const getAxisTypeForRange = ( range ) => {
	return typeof range[0] === 'number' ? numberRange( range ) : categoryRange( range );
}

