import * as colors from "../colors";
import { isDarkTheme } from "./isDarkTheme";
import { fontWeight } from "../fonts";

/**
 * Consistent buttons styling
 * @param {Boolean} dark
 * @returns {Object}
 */
const buttonStyling = ( dark ) => ({
	font: {
		color: dark ? colors.getColor('label') : '#666',
		weight: fontWeight(),
		size: 10
	},
	bgcolor: dark ? 'rgba(100,100,100,0.1)' : 'rgba(150,150,150,0.1)',
	activecolor: dark ? '#0A335F' : 'rgb(255,255,255)',
	bordercolor: dark ? '#444' : '#fff',
	borderwidth: dark ? 1 : 2,
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
	}, buttonStyling(isDarkTheme()));

	// could be multiple menus
	layout.updatemenus = [ menu ];
};

export { buttonStyling, addDropDown }