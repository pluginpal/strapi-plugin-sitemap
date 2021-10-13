/**
 * Make a time string double digit. So make 9 in to 09.
 *
 * @param {int} number - The number.
 *
 * @returns {int} The double digit number.
 */
const doubleDigits = (number) => {
  return (`0${number}`).slice(-2);
};

/**
 * Format a timestamp to hh:mm:ss.
 *
 * @param {int} timestamp - The unix timestamp.
 * @param {bool} withSeconds - Whether to include the seconds.
 *
 * @returns {string} The formatted time.
 */
export const formatTime = (timestamp, withSeconds = false) => {
  const dateObj = new Date(timestamp);
  const hours = doubleDigits(dateObj.getHours());
  const minutes = doubleDigits(dateObj.getMinutes());
  const seconds = doubleDigits(dateObj.getSeconds());

  return `${hours}:${minutes}${withSeconds ? `:${seconds}` : ''}`;
};
