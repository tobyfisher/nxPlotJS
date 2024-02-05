import * as debug from "debug";
import * as layouts from "plotLayouts/layouts";

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

debug.log(`nxPlot is available - Plot.ly v${Plotly.version}`);

const allowedTemplates = new Set([
	"barChart",
	"eyesOutcomes_Errors",
	"eyesOutcomes_offScale_selectableVA",
	"outcomes_Errors",
	"splitRL_Adherence",
	"splitRL_Glaucoma_selectableVA",
	"splitRL_MedicalRetina_selectableVA"
]);

const plotTemplates = new Map();
for( const template of allowedTemplates){
	plotTemplates.set(template, layouts[template]);
}

const nxPlot = ( requestedPlotLayout, divID = false ) => {

	try {
		const nxLayout = plotTemplates.get(requestedPlotLayout);
		nxLayout.setPlotlyDiv(divID);

		/**
		 * Some plotTemplates require setting up, this could
		 * be exposed as an API with options but for now
		 * handle internally
		 */
		nxLayout.setup();
		debug.log(`Building: ${ requestedPlotLayout}`);

		/**
		 * User changes the theme
		 * re-build to re-draw plot with correct colours
		 */
		document.addEventListener('oeThemeChange', () => {
			nxLayout.plotlyThemeChange();
		});

		return nxLayout;

	} catch ({ name }){
		console.error( name );
		console.error(`Requested plot template: "${requestedPlotLayout}" is invalid. 
		Valid plotTemplates are:\n${Array.from(plotTemplates.keys()).join("\n")}` );

		return false;
	}
}

/**
 * Public API
 */
Object.defineProperty(window, 'nxPlot', {
	value: nxPlot,
	writable: false
});