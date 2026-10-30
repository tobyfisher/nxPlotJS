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
		primary: '#AFD2DD',
		blue: {
			oe: '#63d7d6',
			spike: '#6ff',
			annotate: '#34A3CB',
		},
		colorwaySeries: {
			eyeGreen: [ '#43C800' ],
			eyeRed: [ '#F11000' ],
			eyeBEO: ['#E69812'],
			standard: [ '#3988E9', '#AE00AB', '#ED7A00',  '#008E51' ],
			dual: [ '#117CE1', '#1B43AA' ]
		},
		split: {
			right: {
				barBgColor: '#027C28',
				barLineColor: '#3AB700',
			},
			left: {
				barBgColor: '#A40911',
				barLineColor: '#D41605',
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
		primary: '#00295B',
		blue: {
			oe:'#00a',
			spike: '#11a',
			annotate: '#1765CF',
		},
		colorwaySeries: {
			eyeGreen: [ '#0A9000' ],
			eyeRed: [ '#DB1010' ],
			eyeBEO: ['#D98600'],
			standard: [ '#0A3BD0', '#C805C4', '#E69812', '#067E4A' ],
			dual: [ '#4D9FC5', '#466BD0' ],
		},
		split: {
			right: {
				barBgColor: '#78E970',
				barLineColor: '#0DBE00',
			},
			left: {
				barBgColor: '#FD8383',
				barLineColor: '#DF0202',
			}
		},
	}
};

/**
 * Get oe "blue"
 * @returns {String} for hex
 * @param blue
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
		case "duo":
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
		case 'rightEye':
			return colours[theme].colorwaySeries.eyeGreen[0];
		case 'leftEye':
			return colours[theme].colorwaySeries.eyeRed[0];
		case 'BEO':
			return colours[theme].colorwaySeries.eyeBEO[0];
		case 'standard':
			return colours[theme].colorwaySeries.standard[0];
		case 'purple':
			return colours[theme].colorwaySeries.standard[1];
		case 'orange':
			return colours[theme].colorwaySeries.standard[2];

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