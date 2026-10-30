import { markerFor } from "./markerFor";
import { getAxis } from "../../../getAxis";
import { yTrace } from "./yTrace";
import { isDarkTheme } from "../../../helpers/isDarkTheme";
import { getBlue } from "../../../colors";

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
const buildEvents = ( events, yaxis, sideColors ) => {

	const
		traces = [];

	for( const event of events ) {
		if ( event.event === "durationBar" ){
			traces.push(horizontalBarTrace(event, yaxis, sideColors ));
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
	trace.marker.opacity = isDarkTheme() ? 0.8 :  0.9;
	trace.customdata = eventData.customdata;
	trace.hovertemplate = '%{y}<br>%{customdata}<br>%{x}<extra></extra>';

	if( eventData.event === "report"){
		trace.marker.color = getBlue();
	}

	return trace;
}

const horizontalBarTrace = (
	{ xStart, msDuration, name, y, customdata },
	yaxis, sideColors ) => ({
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
		cornerradius: 1,
		thicknessmode: "fraction",
		opacity: isDarkTheme() ? 0.8 :  0.9,
		color: sideColors.barBgColor,
		line: {
			width: 2,
			color: sideColors.barLineColor,
		}
	},
	xhoverformat: "%e %b %Y",
	hovertemplate: '%{y}<br>%{customdata}<extra></extra>',
});

export { calcEventLayout, eventAxis, buildEvents };

