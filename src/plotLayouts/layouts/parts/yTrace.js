const yTrace = ( yaxis, { x, y }, name, xformat = "%e %b %Y" ) => ({
	yaxis, // note: y1 = y = default
	x,y,name,
	type: 'scatter',
	xhoverformat: xformat
});

const yBars = ( yaxis, { x, y }, name, xformat = "%e %b %Y" ) => ({
	yaxis, // note: y1 = y = default
	x,y,name,
	type: 'bar',
	orientation: 'h',
	xhoverformat: xformat
});

export { yTrace, yBars }