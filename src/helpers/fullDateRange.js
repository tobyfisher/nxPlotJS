/**
 * Helper to work out first and last dates.
 * There is (was?) a bug in Plot.ly (known!) to do with the Navigator range
 * this helps fix that that issue, but it seems fixed in latest version
 * @returns {Object}
 */
export const fullDateRange = () => ({
	all: [],
	// pass in array of dates
	add( xArr ){
		this.all = this.all.concat(xArr);
		this.all.sort();
	},
	// used in the layout e.g: rangeSlider: helpers.dateRange.firstLast()
	// used on the xaxis e.g. range: helpers.dateRange.firstLast(),
	firstLast(){
		// watch out for null values
		let noNulls = this.all.filter(( i ) => i !== null);
		return [ noNulls[0], noNulls.pop() ];
	},
});