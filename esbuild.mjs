import * as esbuild from 'esbuild';
import 'dotenv/config';

const define = {
	'process.env.VERSION': JSON.stringify(process.env.VERSION)
}

let ctx = await esbuild.context({
	entryPoints: [ './src/app.js'],
	outfile: `./dist/nxPlot.${process.env.VERSION}.min.js`,
	bundle: true,
	write: true,
	format: 'iife',
	minifyWhitespace: true,
	minifySyntax: true,
	define
})

await ctx.watch();
console.log('watching...');

