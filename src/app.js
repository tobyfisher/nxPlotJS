import * as debug from "./debug";
import * as layouts from "./layouts";

debug.log(`nxPlot is available - Plot.ly v${Plotly.version}`);

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

const templates = new Map();

// data all on one single plot
templates.set("barChart", layouts.barChart);
templates.set("eyesOutcomes_Errors", layouts.eyesOutcome_Errors);
templates.set("eyesOutcomes_offScale_selectableVA", layouts.eyesOutcomes_offScale_selectableVA);
templates.set("outcomes_Errors", layouts.outcomes_Errors);

// split data into 2 different plots for Right and Left eye
templates.set("splitRL_Adherence", layouts.splitRL_Adherence);
templates.set("splitRL_Glaucoma_selectableVA", layouts.splitRL_Glaucoma_selectableVA);
templates.set("splitRL_MedicalRetina_selectableVA", layouts.splitRL_MedicalRetina_selectableVA);


const nxPlot = ( requestedPlotLayout, divID = false ) => {

	if ( templates.has(requestedPlotLayout) ){

		const nxLayout = templates.get(requestedPlotLayout);
		nxLayout.setPlotlyDiv(divID);

		/**
		 * Users changes the theme
		 * re-build to re-draw plot with correct colours
		 */
		document.addEventListener('oeThemeChange', () => {
			nxLayout.plotlyThemeChange();
		});

		debug.log(`Building: ${ requestedPlotLayout}`);

		return nxLayout;

	} else {
		console.error(`Requested plot template: "${requestedPlotLayout}" is invalid.
			Valid templates are: ${Array.from(templates.keys()).join(", ")}`);

		return false;
	}
}

Object.defineProperty(window, 'nxPlot', {
	value: nxPlot,
	writable: false
});