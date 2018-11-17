/**
 * Converts a Date object to a string in hh:mm format.
 * @param {Date} date 
 */
export const printTime = date => date.toLocaleTimeString('nl-nl', { hour: '2-digit', minute: '2-digit' });