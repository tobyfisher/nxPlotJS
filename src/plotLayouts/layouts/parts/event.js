import { markerFor } from "./markerFor";
import * as debug from "../../../debug";
import { getAxis } from "../../../getAxis";
import { yTrace } from "./yTrace";

/**
 * Domain layout adjusts to number of Events (Reports, Mgmt, Drugs, etc)
 * Always allows for a single row, if there NO Events it shows a message "No events"
 * @param numOfEvents
 */
const calcEventLayout = ( numOfEvents = 0 ) => {
	const row = 4; // % percentage of plot
	const domainShift = row * numOfEvents;
	return Math.max(row, domainShift);
}

/**
 * Event axis use Annotations instead of ticklabels
 */

const eventAxis = ( domain, events ) => {
	return getAxis({
		type: 'y',
		domain,
		useCategories: {
			categoryarray: events,
			rangeFit: "pad", // "exact", etc
		},
		spikes: true,
		hideLabels: true,
		hideGridLines: true,
	});
}

/**
 * build Event traces for plotly
 * ALL Y values should be same for each trace
 * @returns {Array}
 */
const buildEvents = ( events, yaxis, side ) => {

	const
		traces = [];

	for( const event of events ) {
		if ( event.event === "durationBar" ){
			traces.push(horizontalBarTrace(event, yaxis));
		} else {
			traces.push(eventTrace(event, yaxis));
		}
	}

	return traces;
};

const eventTrace = ( eventData, yaxis, color ) => {
	const trace = yTrace(yaxis, eventData, eventData.name);
	trace.mode = "markers";
	trace.showlegend = false;
	trace.marker = markerFor(eventData.event);

	if ( eventData.customdata !== undefined ){
		trace.customdata = [ eventData.customdata ];
		//trace.hovertemplate = '%{y}<br>%{customdata}<br>%{x}<extra></extra>';
	} else {
		trace.hovertemplate = '%{y}<br>%{x}<extra></extra>';
	}
	return trace;
}

const horizontalBarTrace = (
	{ xStart, msDuration, name, y, customdata },
	yaxis ) => ({
	type: 'bar',
	orientation: 'h',
	width: 0.6,
	yaxis,
	base: Date.parse(xStart),
	x: [ msDuration ],
	y,
	name,
	customdata,
	xperiodalignment: "start",
	showlegend: false,
	marker: {
		cornerradius: 3,
		thicknessmode: "fraction",
		opacity: 0.9,
		color: "pink",
		line: {
			width: 1,
			color: "#f00",
		}
	},
	xhoverformat: "%e %b %Y",
	hovertemplate: '%{y}<br>%{customdata}<extra></extra>',
});

export { calcEventLayout, eventAxis, buildEvents };

