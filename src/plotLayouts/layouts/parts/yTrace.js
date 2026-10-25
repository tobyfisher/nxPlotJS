export const yTrace = ( yaxis, { x, y }, name, xformat = "%e %b %Y" ) => ({
	yaxis, // note: y1 = y = default
	x,y,name,
	type: 'scatter',
	xhoverformat: xformat
});