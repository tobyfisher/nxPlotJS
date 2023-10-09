import * as debug from "debug";
import * as layoutPlots from "./layouts";

/**
 * newbluePlot - Facade pattern
 * A "black box" to correctly, and consistently, display all plot.ly charts in OE.
 * All required data for a chart is passed in agreed JSON format for the requested layout template.
 * This replaces a previous, simpler oePlotly helper in "newblue"
 * see: newblue/plotlyJS/oePlotly_v1.js
 *
 * https://plot.ly/javascript/reference/
 * @namespace "newbluePlot" - publicly available
 *
 * Important, if User changes the theme this must generate a broadcast Event
 */
debug.listModule("newbluePlot");

/**
 * Initated from within DOM
 * @param templateName {string} requested template layout
 * @param plotJSON {JSON} - correct agreed format for template
 * @param divID {String} id for <div> (optional)
 */
const nbp = ( templateName, plotJSON, divID = false ) => {
	debug.log(`newbluePlot | plotLayout: ${templateName}`);

	const templates = new Map();
	// data all on one single plot
	templates.set("barChart", layoutPlots.barChart);
	templates.set("eyesOutcomes_Errors", layoutPlots.eyesOutcome_Errors);
	templates.set("eyesOutcomes_offScale_selectableVA", layoutPlots.eyesOutcomes_offScale_selectableVA);
	templates.set("outcomes_Errors", layoutPlots.outcomes_Errors);

	// split data into 2 different plots for Right and Left eye
	templates.set("splitRL_Adherence", layoutPlots.splitRL_Adherence);
	templates.set("splitRL_Glaucoma_selectableVA", layoutPlots.splitRL_Glaucoma_selectableVA);
	templates.set("splitRL_MedicalRetina_selectableVA", layoutPlots.splitRL_MedicalRetina_selectableVA);

	if ( templates.has(templateName) ){
		templates.get(templateName).init(plotJSON, divID);
	} else {
		debug.error('newbluePlot', `Requested plot template: "${templateName}" is invalid \nValid templates are: ${Array.from(templates.keys()).join(", ")}`);
	}
}

Object.defineProperty(window, 'newbluePlot', {
	value: nbp,
	writable: false
});