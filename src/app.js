import * as debug from "./debug";
import * as layouts from "./plotLayouts/layouts";
import { getBlue, getColor, getColorSeries } from "./colors";

/**
 * nxPlotJS - Facade pattern
 * A wrapper around plotly.js to correctly, and consistently, display all plot.ly charts in OE.
 * nxPlotJS provides a simple API from which it builds a Plot.ly chart
 *
 * https://plot.ly/javascript/reference/
 * @namespace "nxPlot" - publicly available
 *
 * Generate a broadcast Event to let nxPlot know about it
 * https://github.com/tobyfisher/nxPlotJS#theme-change
 *
 */

if( window.hasOwnProperty('Plotly') ){
	debug.log(`nxPlot is available, using Plot.ly v${Plotly.version}`);
} else {
	debug.error('Plot.ly JS is required');
}

const allowedTemplates = new Set([
	"customData",
	"barChart",
	"PCR_Risk",
	"eyesOutcomes_Errors",
	"eyesOutcomes_vaChangeableUnits",
	"outcomes_Errors",
	"splitRL_Adherence",
	"splitRL_Glaucoma_vaChangeableUnits",
	"splitRL_MedicalRetina_vaChangeableUnits",
	"splitRL_Strabismus"
]);



const plotTemplates = new Map();
for( const template of allowedTemplates){
	plotTemplates.set(template, layouts[template]);
}

const nxPlot = ( requestedPlotLayout, divID ) => {
	let nxLayout = plotTemplates.get(requestedPlotLayout);

	/**
	 * check nxLayout exists
	 */
	if( nxLayout === undefined ){
		console.error(`Requested plot template: "${requestedPlotLayout}" is undefined. plotTemplates:\n${Array.from(plotTemplates.keys()).join("\n")}` );
		return false;
	}

	/**
	 * Plotly must have a graphDiv
	 */
	const graphDiv = document.getElementById(divID);
	if ( graphDiv === null ){
		debug.error(`div is null?, check id: ${divID}`);
		return false
	}

	/**
	 * However, if it's a splitRL template graphDiv must have 2 child divs:
	 *
	 * |- <div class="oes-right-side"><!-- JS hook --></div>
	 * |- <div class="oes-left-side"><!-- JS hook --></div>
	 */

	nxLayout.setPlotlyDiv( graphDiv, requestedPlotLayout.startsWith('splitRL') );
	nxLayout.prebuild(); // prebuild hook (optional), used to set up the toolbar

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