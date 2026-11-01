export const customTraceLine = (opts = {}) => {
	const {
		width = 2,
		color,
		dashed = false,
		dash,
		smooth = false,
		smoothing = 1,
	} = opts;

	return {
		// retain width even if 0 was passed
		width: width ?? 2,
		...(color != null ? { color } : {}),
		// explicit precedence for dash vs dashed
		...(dash != null ? { dash } : dashed ? { dash: "2px,2px" } : {}),
		...(smooth ? { shape: "spline", smoothing } : {}),
	};
};