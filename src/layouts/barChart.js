import * as debug from "debug";
import { getAxis } from "../getAxis";
import { getLayout } from "../getLayout";
import { coreLayout } from "./coreLayout";

const barChart = Object.create(coreLayout);

barChart.buildData = function( plotData ){
	/**
	 * Data - for Plotly
	 * Simple traces, trace colour controlled by the Layout
	 */
	const trace = {
		y: plotData.y,
		name: plotData.name,
		type: 'bar'
	};

	// these are optional settings
	if ( plotData.hasOwnProperty('x') ) trace.x = plotData.x;
	if ( plotData.hasOwnProperty('hovertemplate') ) trace.hovertemplate = plotData.hovertemplate;

	this.data =  [ trace ];
}

barChart.buildLayout = function( layoutData ){
	// store layout data for rebuilding on theme change
	if( !this.stored.has("layout" ) ){
		this.stored.set("layout", layoutData);
	}

	const x1 = getAxis({
		type: 'x',
		numTicks: 20,
	});

	const y1 = getAxis({
		type: 'y',
		numTicks: 20,
	});

	if ( layoutData.titles.hasOwnProperty('x') ) x1.title = layoutData.titles.x;
	if ( layoutData.titles.hasOwnProperty('y') ) y1.title = layoutData.titles.y;

	this.layout = getLayout({
		plotTitle: layoutData.plotHeader,
		xaxis: x1,
		yaxes: [ y1 ],
		barmode: "stack"
	});
};

/**
 * Build or re-build plotly (if there is a theme change)
 * A complete rebuild is easier (more reliable) than trying to
 * individually go through all the API and change specific colours
 */
barChart.plotlyThemeChange = function(){
	barChart.buildLayout( this.stored.get("layout")); // rebuild the layout
	this.plotlyReact();
}


export { barChart };