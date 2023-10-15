/**
 * Debug to console log
 */
const prefix = "[nxPlot]";

/**
 * Log to console with a fixed prefix
 * @param {String} msg - message to log
 */
const log = ( msg ) => console.log(`${prefix} ${msg}`);
const error = ( msg ) => console.error(`${prefix} Error: ${msg}`);

export { log, error }