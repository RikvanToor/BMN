
/**
 * Converts a Date object to a nicely readable date string.
 * @param {Date} dateObj The date object
 * @returns {string} String representation of the date part of the date.
 */
export function readableDate(dateObj){
  return dateObj.toLocaleDateString('nl-nl', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

export const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Converts the time part of a Date object to a nicely readable time string
 * @param {Date} dateObj The date object
 * @returns {string} String representation of the time part of the date
 */
export function readableTime(dateObj) {
  return dateObj.toLocaleTimeString('nl-nl', { hour: '2-digit', minute: '2-digit' });
}
export function atNoon(date){
  date.setHours(12);
  date.setMinutes(0);
  date.setSeconds(0);
  date.setMilliseconds(0);
  return date;
}

/**
 * Changes the hour of an integer time, represented as an element in [0, 2400) for time
 * @param {int} intTime The original time
 * @param {int} hour The hour
 * @returns {int} The new integer time
 */
export function changeHour(intTime, hour){
  return intTime - Math.floor(intTime / 100) * 100 + hour * 100;
}

/**
 * Changes the minutes of an integer time, represented as an element in [0, 2400) for time
 * @param {int} intTime The original time
 * @param {int} minutes The new minutes
 * @returns {int} The new integer time
 */
export function changeMinutes(intTime, minutes){
  return Math.floor(intTime / 100) * 100 + minutes;
}

export function getDaysInMonth(monthNumber, year){
  let monthLength = daysInMonth[monthNumber];
  if (monthNumber === 1) { //Februari
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
      monthLength = 29;
    }
  }
  return monthLength;
}

export function getWeekNumber(dateObj){
  const target  = new Date(dateObj.valueOf());
  const dayNr   = (dateObj.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
  }
  return 1 + Math.ceil((firstThursday - target) / 604800000);
}

export function dateOnlyFromISO(isoString){
  return new Date(`${isoString.slice(0,10)}T12:00:00.000Z`);
}