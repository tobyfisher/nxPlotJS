// Plugins
import { terser } from 'rollup-plugin-terser';
import includePaths from 'rollup-plugin-includepaths';

/**
 * allows root aggregate modules to be
 * accessed anywhere,
 * e.g "utils.js" = "./src/utils.js"
 * However, if you want to use the ES2015 directly
 * these paths will need updating to relative paths (Rollup can do this!)
 */
let includePathOptions = {
	include: {},
	paths: [ './src' ],
	external: [],
	extensions: [ '.js' ]
};

const build = Date();

/**
 * Output JS
 */
export default {
	input: 'src/app.js', // required
	plugins: [ includePaths(includePathOptions) ],
	output: [ {
		file:'/Users/toby/Sites/work/oe/idg/src/build/assets/js/idg-dev/idgJS-2022.min.js',
		format: 'iife',
		plugins: [ terser()],
		banner: `/*! ${build} */`
	}, {
		file:'/Users/toby/Sites/work/oe/idg/src/build/assets/js/idg-dev/idgJS-2022.js',
		format: 'iife',
		banner: `/*! ${build} */`
	},],
};