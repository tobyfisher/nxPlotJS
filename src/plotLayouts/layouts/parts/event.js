import { markerFor} from "./markerFor";
import * as debug from "../../../debug";
import { getAxis } from "../../../getAxis";
import { yTrace } from "./yTrace";

/**
 * Domain layout adjusts to number of Events (Reports, Mgmt, Drugs, etc)
 * Always allows for a single row, if there NO Events it shows a message "No events"
 * @param numOfEvents
 */
const calcEventLayout = ( numOfEvents = 0) => {
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
 * Events subplot
 * @returns {Array}
 */
const buildEvents = ( events, yaxis ) => {
	/**
	 * Convert all Event data objects into Event traces for plotly
	 * ALL Y values should be the SAME!
	 */
	return Object.values(events).map(( eventData ) => {
		if(eventData.event === "durationBar"){
			return horizontalBarTrace( eventData, yaxis );
		} else {
			return eventTrace( eventData, yaxis );
		}
	});
};

const eventTrace = ( eventData, yaxis ) => {
	const trace = yTrace(yaxis, eventData, eventData.name);
	trace.mode = "markers";
	trace.showlegend = false;
	trace.marker =  markerFor(eventData.event);

	if ( eventData.customdata !== undefined ){
		trace.customdata = [eventData.customdata];
		//trace.hovertemplate = '%{y}<br>%{customdata}<br>%{x}<extra></extra>';
	} else {
		trace.hovertemplate = '%{y}<br>%{x}<extra></extra>';
	}
	return trace;
}


const horizontalBarTrace = ( eventData, yaxis ) => ({
	type: 'bar',
	orientation: 'h',
	width: 0.8,
	yaxis,
	base: Date.parse(eventData.start),
	x: [ (Date.parse( eventData.end) - Date.parse(eventData.start))],
	y: [ eventData.name ],
	name: eventData.name,
	customdata: [eventData.customdata],
	xperiodalignment: "start",
	showlegend: false,
	marker: {
		color: "#363",
			cornerradius: 3,
			thicknessmode: "fraction",
			line: {
			width: 1,
				color: "#3a3",
		}
	},
	xhoverformat: "%e %b %Y",
	hovertemplate: '%{y}<br>%{customdata}<extra></extra>',
});


export { calcEventLayout, eventAxis, buildEvents };

