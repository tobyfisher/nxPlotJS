/**
 * plot color styles based on UI theme mode
 * @returns {Boolean}
 */
const isDarkTheme = () => document.documentElement.classList.contains("theme-dark");

/**
 * Theme colours
 */
const colours = {
	dark: {
		blue: '#63d7d6',
		highlight: '#fff',
		green: '#65d235',
		red: '#ea2b34',
		yellow: '#E8B131',
		greenSeries: [ '#65d235', '#A5D712', '#02B546' ],
		redSeries: [ '#ea2b34', '#F64A2D', '#C92845' ],
		yellowSeries: [ '#FAD94B', '#E8B131', '#F1F555' ], // BEO (Both Eyes Open)
		standard: [ '#1451b3', '#175ece', '#1a69e5' ],
		varied: [ '#0a83ea', '#18949f', '#781cea', '#3f0aea' ],
		dual: [ '#1472DE', '#2E4259' ],
	},
	light: {
		blue: '#00f',
		highlight: '#000',
		green: '#418c20',
		red: '#da3e43',
		yellow: '#E69812',
		greenSeries: [ '#418c20', '#598617', '#139149' ],
		redSeries: [ '#da3e43', '#E64C02', '#E64562' ],
		yellowSeries: [ '#FCCE14', '#E69812', '#FCBB21' ], // BEO
		standard: [ '#94a2b8', '#8398b9', '#8292ab' ],
		varied: [ '#0a2aea', '#ea0a8e', '#00b827', '#890aea' ],
		dual: [ '#2126C2', '#8FAEC2' ],
	}
};

/**
 * Get oe "blue"
 * @param {Boolean} dark
 * @returns {Array} of colour series
 */
const getBlue = () => isDarkTheme() ? colours.dark.blue : colours.light.blue;

/**
 * Get color series
 * @param {String} colour name
 * @returns {Array} of colour series
 */
const getColorSeries = ( colorName ) => {
	const theme = isDarkTheme() ? 'dark' : 'light';
	switch ( colorName ){
		case "varied":
			return colours[theme].varied;
		case "posNeg":
			return colours[theme].dual;
		case "rightEyeSeries":
			return colours[theme].greenSeries;
		case "leftEyeSeries":
			return colours[theme].redSeries;
		case "BEOSeries":
			return colours[theme].yellowSeries;

		default:
			return colours[theme].standard;
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
		case 'highlight':
			return colours[theme].highlight;
		case 'rightEye':
			return colours[theme].green;
		case 'leftEye':
			return colours[theme].red;
		case 'BEO':
			return colours[theme].yellow;

		default:
			return 'pink'; // no match, flag failure to match as pink!
	}
};

/**
 * Axis colors used in getAxis and tools
 * @return {string}
 */
const getAxisGridColor = () => isDarkTheme() ? '#292929' : '#e6e6e6';
const getAxisTickColor = () => isDarkTheme() ? '#666' : '#ccc';

export { isDarkTheme, getBlue, getColorSeries, getColor, getAxisTickColor, getAxisGridColor };