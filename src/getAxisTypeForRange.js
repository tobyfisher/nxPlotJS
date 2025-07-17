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

const customTicks = ( range ) => ({
	customTicks: { ... range}
});

export const getAxisTypeForRange = ( range ) => {
	if( Array.isArray( range )){
		/**
		 * range type axis [], but could be a number range or categories
		 */
		return typeof range[0] === 'number' ? numberRange( range ) : categoryRange( range );
	}

	/**
	 * if not Array it's an object
	 */
	return customTicks( range );
}

