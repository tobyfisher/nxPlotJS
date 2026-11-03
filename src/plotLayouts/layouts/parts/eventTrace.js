import { markerFor } from "./markerFor";
import { yTrace } from "./yTrace";
import { isDarkTheme } from "../../../helpers/isDarkTheme";
import { getBlue } from "../../../colors";

const eventTrace = ( eventData, yaxis ) => {

	const marker = markerFor(eventData.event);
	marker.opacity = isDarkTheme() ? 0.8 :  0.9;

	const trace = {
		...yTrace(yaxis, eventData, eventData.name),
		mode: "markers",
		showlegend: false,
		marker,
		nxReport: eventData.event === "report",
		customdata: eventData.customdata,
		hovertemplate: '%{y}<br>%{customdata}<br>%{x}<extra></extra>',
	}

	return trace;
}

const eventHorizontalBar = ({ xStart, msDuration, name, y, customdata }, yaxis, sideColors ) => ({
	type: 'bar',
	orientation: 'h',
	width: 0.7,
	yaxis,
	base: Date.parse(xStart),
	x: [ msDuration ],
	y,
	name,
	customdata,
	hovertemplate: '%{y}<br>%{customdata}<extra></extra>',
	xperiodalignment: "start",
	showlegend: false,
	marker: {
		cornerradius: 1,
		thicknessmode: "fraction",
		opacity: isDarkTheme() ? 0.8 :  0.9,
		color: sideColors.barBgColor,
		line: {
			width: 1,
			color: sideColors.barLineColor,
		}
	}
});

export { eventTrace, eventHorizontalBar };