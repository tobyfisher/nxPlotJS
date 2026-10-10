/**
 * Legends can be over or outside the plot
 * they can horizontal or vertical
 * - traces can be grouped, but this requires: legendgroup: '{name}' on trace
 * - traces can be hidden from legend with: showlegend: false on trace
 */

const legendDefaults = {
		font: {
			size: 9
		},
		itemclick: 'toggleothers', //  ( default: "toggle" | "toggleothers" | false )
		// traceorder: "grouped", // or "reversed+grouped"
		xanchor: 'right', // "auto" | "left" | "center" | "right"
		yanchor: 'bottom', // "auto" | "top" | "middle" | "bottom"
		x: 1,  // 0 to 1
		y: 1,  // 0 to 1 e.g. 1 is the top to the plot, combined with yanchor means it's outside the plot area
	};

export const getLegend = {

	horizontal( yanchor, y = 1  ){
		return Object.assign(legendDefaults, {
			orientation: 'h',
			yanchor,
			y
		});
	},

	vertical( yanchor, y = 1  ){
		return Object.assign(legendDefaults, {
			orientation: 'v',
			yanchor,
			y
		})
	}
};
	
