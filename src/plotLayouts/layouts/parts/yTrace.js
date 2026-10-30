export const yTrace = ( yaxis, { x, y }, name, isDate = true  ) => ({
	yaxis, // note: y1 = y = default
	x,y,name,
	type: 'scatter',
	xhoverformat: isDate ? "%e %b %Y" : "",
});