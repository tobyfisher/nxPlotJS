import * as debug from "debug";
import * as layouts from "plotLayouts/layouts";
import { getBlue, getColor, getColorSeries } from "./colors";

/**
 * nxPlotJS - Facade pattern
 * A wrapper around plotly.js to correctly, and consistently, display all plot.ly charts in OE.
 * nxPlotJS provides a simple API from which it builds a Plot.ly chart
 *
 * https://plot.ly/javascript/reference/
 * @namespace "nxPlot" - publicly available
 *
 * Note: if User changes the theme generate a broadcast Event to let nxPlot know about it
 */

if( window.hasOwnProperty('Plotly') ){
	debug.log(`nxPlot is available, using Plot.ly v${Plotly.version}`);
} else {
	debug.error('Plot.ly JS is required');
}

const allowedTemplates = new Set([
	"customData",
	"barChart",
	"eyesOutcomes_Errors",
	"eyesOutcomes_offScale_selectableVA",
	"outcomes_Errors",
	"splitRL_Adherence",
	"splitRL_Glaucoma_selectableVA",
	"splitRL_MedicalRetina_selectableVA",
	"splitRL_Strabismus"
]);

const plotTemplates = new Map();
for( const template of allowedTemplates){
	plotTemplates.set(template, layouts[template]);
}

const nxPlot = ( requestedPlotLayout, divID = false ) => {
	let nxLayout = false;

	try {
		nxLayout = plotTemplates.get(requestedPlotLayout);
		debug.log(`Building: ${ requestedPlotLayout}`);
	} catch ({ name }){
		console.error(`Requested plot template: "${requestedPlotLayout}" is invalid. 
		Valid plotTemplates are:\n${Array.from(plotTemplates.keys()).join("\n")}` );
		return nxLayout;
	}

	nxLayout.setPlotlyDiv(divID); // Plotly requires a div
	nxLayout.prebuild(); // prebuild hook (optional), see in layouts for how this is used

	/**
	 * nxPlotJS will react to OE theme change
	 */
	document.addEventListener('oeThemeChange', () => {
		nxLayout.plotlyThemeChange();
	});

	return nxLayout;
}

/**
 * Public API
 */
Object.defineProperty(window, 'nxPlot', {
	value: nxPlot,
	writable: false
});

// provide access to nxPlot colors, e.g. highlight blue
// this allows custom traces to used, see Visual Fields demo
Object.defineProperty( window, 'nxPlotColor', {
	value: {
		getBlue: getBlue,
		getColor: getColor,
		getColorSeries: getColorSeries
	},
	writable: false
})