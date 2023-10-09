import * as colors from "../colors";

/**
 * Consistent buttons styling
 * @param {Boolean} dark
 * @returns {Object}
 */
const buttonStyling = ( dark ) => ({
	font: {
		color: dark ? '#ccc' : '#666',
	},
	bgcolor: dark ? 'rgb(30,46,66)' : 'rgb(255,255,255)',
	activecolor: dark ? 'rgb(7,69,152)' : 'rgb(225,225,225)',
	bordercolor: dark ? 'rgb(10,26,36)' : 'rgb(255,255,255)',
	borderwidth: 2,
});

/**
 * Add Plotly dropdown to layouts
 * @param {*} layout
 */
const addDropDown = ( layout ) => {

	let buttons = [];

	buttons.push({
		method: 'update', // 'data' & 'layout'
		args: [ 'visible', [ true, false, false, false ] ],
		label: 'Option 1'
	});

	buttons.push({
		method: 'update', // update args: [data, layout]
		// 'args' is an
		args: [ {}, {
			title: 'some new title', // updates the title
			colorway: colors.getColorSeries("default", true)
		} ],
		//args2: layout,
		label: 'Options Title'
	});

	let menu = Object.assign({
		type: "dropdown",
		xanchor: 'left',
		yanchor: 'top',
		x: 0,
		y: 0.35,
		buttons: buttons, // add buttons to menu
	}, buttonStyling(colors.isDarkTheme()));

	// could be multiple menus
	layout.updatemenus = [ menu ];
};

export { buttonStyling, addDropDown }