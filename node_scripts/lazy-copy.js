'use strict';

/**
 * Lazy copy anything changed in ./dist over to knowego
 */

const
	knowego = '/Users/toby/Sites/work/oe/idg/src/build/assets/js/nxplot/',
	fsp = require('fs/promises'),
	chokidar = require('chokidar'),
	chalk = require('chalk');


const watcher = chokidar.watch('./dist', {
	persistent: true
});

watcher.on('change', ( path ) => {
	console.log(`> change: ${path}`);
	fsp.copyFile( path, `${knowego}${path}`)
	.then(() => {
		const now = new Date(Date.now());
		console.log(chalk.green(`--> lazy copied: ${now.toLocaleTimeString("en-US")}`));
	})
});

console.log( chalk.green('>> lazy copy ./dist to knowego.'));
console.log( chalk.green('>> ... watching for changes'));
console.log( chalk.red('--- note: only looking for changes, not new files!'));