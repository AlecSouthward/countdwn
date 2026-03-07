/**
 * @param date Any date (past/present/future).
 * @returns Pretty string representation of the date in the format `dd MMM yyyy`, or `"1 Jan 2026"`.
 */
export const formatDateForDisplay = (date: Date) => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * @param date A date in the future.
 * @returns Pretty string representation of the time until `date`.
 */
export const getRelativeTimeUntilDate = (date: Date) => {
  const nowDate = new Date();
  nowDate.setUTCHours(0, 0, 0, 0);

  const diffMs = date.getTime() - nowDate.getTime();

  if (diffMs < 0) return 'in the past';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  if (days === 0) return `today`;
  if (days === 1) return `tomorrow`;
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} left`;
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} left`;

  return `${years} year${years === 1 ? '' : 's'} left`;
};

/**
 * @param startDate The starting date.
 * @param endDate The ending date.
 * @returns The percentage between `startDate` and `endDate` based on the current date.
 */
export const getPercentageBetweenDates = (startDate: Date, endDate: Date) => {
  const now = Date.now();
  const start = startDate.getTime();
  const end = endDate.getTime();

  if (end < now) {
    return 100;
  }

  const percentage = ((now - start) / (end - start)) * 100;

  return Math.floor(Math.min(100, Math.max(0, percentage)));
};
