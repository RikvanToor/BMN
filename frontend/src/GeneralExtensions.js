/**
 * Converts a Date object to a string in hh:mm format.
 * @param {Date} date 
 */
export const printTime = date => date.toLocaleTimeString('nl-nl', { hour: '2-digit', minute: '2-digit' });

/**
 * Converts a Date object to a string in weekday d hh:mm in Dutch
 * For example 'dinsdag 20 november 2018 21:00'
 * @param {Date} date 
 */
export const printDateTime = date => date.toLocaleString('nl-NL', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'});