import { isDarkTheme } from "./helpers/isDarkTheme";

/**
 * plot color styles based on UI theme mode
 * Theme colours
 */
const colours = {
	dark: {
		paper: 'rgba(100,100,100,0.1)',
		plot: '#111',
		axis: { grid: '#292929', tick: '#666666' },
		label: '#aaa',
		grey: '#666',
		highlight: '#fff',
		max: '#000',
		blue: {
			oe: '#63d7d6',
			spike: '#6ff',
			annotate: '#34A3CB',
		},
		orange: '#FF8C11',
		green: '#65d235',
		red: '#ea2b34',
		yellow: '#E8B131',
		colorwaySeries: {
			eyeGreen: [ '#09AA46' ],
			eyeRed: [ '#82171C' ],
			standard: [ '#1451b3', '#175ece', '#1a69e5', '#0a83ea', '#18949f', '#781cea', '#3f0aea' ],
			dual: [ '#1472DE', '#2E4259' ]
		},
		split: {
			right: {
				barBgColor: '#027C28',
				barLineColor: '#42D100',
			},
			left: {
				barBgColor: '#A40911',
				barLineColor: '#F31D06',
			}
		},
	},
	light: {
		paper: 'rgba(255,255,255,0.4)',
		plot: '#fff',
		axis: { grid: '#e6e6e6', tick: '#cccccc' },
		label: '#333',
		grey: '#ccc',
		highlight: '#000',
		max: '#fff',
		blue: {
			oe:'#00a',
			spike: '#11a',
			annotate: '#1765CF',
		},
		orange: '#CE4100',
		green: '#418c20',
		red: '#da3e43',
		yellow: '#E69812',
		colorwaySeries: {
			eyeGreen: [ '#86E481' ],
			eyeRed: [ '#da3e43' ],
			standard: [ '#6A83C7', '#5579CD', '#578BC6', '#0a2aea', '#ea0a8e', '#00b827', '#890aea' ],
			dual: [ '#2126C2', '#8FAEC2' ],
		},
		split: {
			right: {
				barBgColor: '#78E970',
				barLineColor: '#0A9A00',
			},
			left: {
				barBgColor: '#FD8383',
				barLineColor: '#B70202',
			}
		},
	}
};

/**
 * Get oe "blue"
 * @param {Boolean} dark
 * @returns {Array} of colour series
 */
const getBlue = ( blue = "oe" ) => colours[isDarkTheme() ? 'dark' : 'light'].blue[blue];

/**
 * Get color series, default base for layouts
 * can be overridden in individual traces
 * @param {String} colour name
 * @returns {Array} of colour series
 */
const getColorSeries = ( colorName ) => {
	const theme = isDarkTheme() ? 'dark' : 'light';
	switch ( colorName ){
		case "posNeg":
			return colours[theme].colorwaySeries.dual;
		case "rightEye":
			return colours[theme].colorwaySeries.eyeGreen;
		case "leftEye":
			return colours[theme].colorwaySeries.eyeRed;

		default:
			return colours[theme].colorwaySeries.standard;
	}
};

/**
 * Some elements require colour setting to be made
 * in the data (trace) objects. This provides a way to
 * theme and standardise
 * @param {String} colour type e.g. "error_y"  for: error_y.color
 * @returns {String} colour for request element (or "pink" if fails)
 */
const getColor = ( colour ) => {
	const theme = isDarkTheme() ? 'dark' : 'light';
	switch ( colour ){
		case 'standard':
			return colours[theme].standard[0];
		case 'rightEye':
			return colours[theme].eyeGreen;
		case 'leftEye':
			return colours[theme].eyeRed;
		case 'BEO':
			return colours[theme].yellow;

		default:
			// a specific colour
			return colours[theme][colour];
	}
};

/**
 * Split charts require side specific colours
 * @param side
 * @return {*}
 */
const getSplitColors = ( side ) => colours[isDarkTheme() ? 'dark' : 'light'].split[side];

/**
 * Axis colors used in getAxis and tools
 * @return {string}
 */
const getAxisGridColor = () => colours[isDarkTheme() ? 'dark' : 'light'].axis.grid;
const getAxisTickColor = () => colours[isDarkTheme() ? 'dark' : 'light'].axis.tick;

export { getBlue, getColorSeries, getColor, getAxisTickColor, getAxisGridColor, getSplitColors };