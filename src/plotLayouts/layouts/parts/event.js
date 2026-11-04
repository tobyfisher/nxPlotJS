import { getAxis } from "../../../getAxis";
import { eventHorizontalBar, eventTrace } from "./eventTrace";

/**
 * Domain layout adjusts to number of Events (Reports, Mgmt, Drugs, etc)
 * Always allows for a single row, if there NO Events it shows a message "No events"
 * @param numOfEvents
 */
const calcEventLayout = ( numOfEvents = 0 ) => {
	const row = 3; // % percentage of plot
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
			traces.push(eventHorizontalBar(event, yaxis, sideColors ));
		} else {
			traces.push(eventTrace(event, yaxis));
		}
	}

	return traces;
};



export { calcEventLayout, eventAxis, buildEvents };

