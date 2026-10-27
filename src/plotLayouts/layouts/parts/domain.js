/**
 * Thinking about domains in terms of percentages but
 * need to provide them to plotly as fractions
 * @param arr
 * @return {*}
 */
export const convertDomain = ( arr ) => {
	return arr.map( n => n / 100);
}