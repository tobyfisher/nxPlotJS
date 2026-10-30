const customTraceLine = ( opts ) => {
	const line = { width: 2 };

	if( opts.dashed ){
		line.dash = "2px,2px";
	}

	if( opts.dash ){
		line.dash = opts.dash;
	}

	if( opts.width ){
		line.width = opts.width;
	}

	if( opts.color ){
		line.color = opts.color;
	}

	if( opts.smooth ){
		line.shape = "spline";
		line.smoothing = 1;
	}

	return line;
}

export { customTraceLine }