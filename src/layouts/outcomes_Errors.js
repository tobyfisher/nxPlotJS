import * as debug from "debug";
import * as colors from "../colors";
import { getAxis } from "../getAxis";
import { getLayout } from "../getLayout";
import { coreLayout } from "./coreLayout";

const outcomes_Errors = Object.create(coreLayout);

/**
 * Build data trace format for Glaucoma outcomes
 * @param oe {Object} data
 * @returns {Array} for Plot.ly data
 */
const buildDataTraces = ( plot ) => {

	const VA = {
		yaxis: 'y1', // y1 = y = default
		x: plot.VA.x,
		y: plot.VA.y,
		name: 'VA',
		hovertemplate: 'Mean ± SD<br>VA: %{y}<br>(N: %{x})',
		type: 'scatter',
		error_y: {
			type: 'data',
			array: plot.VA.error_y,
			visible: true,
			thickness: 0.5,
		}
	};

	const IOP = {
		yaxis: 'y2',
		x: plot.IOP.x,
		y: plot.IOP.y,
		name: 'IOP',
		hovertemplate: 'Mean ± SD<br>IOP: %{y}<br>(N: %{x})',
		type: 'scatter',
		error_y: {
			type: 'data',
			array: plot.IOP.error_y,
			visible: true,
			thickness: 0.5,
		}
	};

	return [ VA, IOP ];
}

outcomes_Errors.buildData = function ( plotData ){
	/**
	 * Data
	 * Simple traces, trace colour controlled by the Layout
	 */
	this.data = buildDataTraces(plotData);
}

outcomes_Errors.buildLayout = function ( layoutData ){
	// store layout data for rebuilding on theme change
	if( !this.stored.has("layout" ) ){
		this.stored.set("layout", layoutData);
	}

	const x1 = getAxis({
		type: 'x',
		title: layoutData.xaxis.title,
		numTicks: 20,
		range: layoutData.xaxis.range,
	});

	const y1 = getAxis({
		type: 'y',
		title: layoutData.yaxis.y1.title,
		range: layoutData.yaxis.y1.range,
		numTicks: 20,
	});

	const y2 = getAxis({
		type: 'y',
		title: layoutData.yaxis.y2.title,
		rightSide: 'y1',
		numTicks: 20,
	});

	/**
	 * Layout
	 */
	this.layout = getLayout({
		colors: 'varied',
		legend: true,
		xaxis: x1,
		yaxes: [ y1, y2 ],
		rangeSlider: true,
	});
};

export { outcomes_Errors }