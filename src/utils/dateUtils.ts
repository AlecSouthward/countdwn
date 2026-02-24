export const formatDateForDisplay = (date: Date) => {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const displayTimeUntilFromDate = (date: Date) => {
  const diffMs = date.getTime() - Date.now();

  if (diffMs < 0) return 'in the past';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30.44);
  const years = Math.floor(days / 365.25);

  if (days < 0) return `today`;
  if (days < 1) return `tomorrow`;
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} left`;
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} left`;

  return `${years} year${years === 1 ? '' : 's'} left`;
};

export const distanceBetweenDates = (startDate: Date, endDate: Date) => {
  const now = Date.now();
  const start = startDate.getTime();
  const end = endDate.getTime();

  const percentage = ((now - start) / (end - start)) * 100;

  if (percentage < 0) {
    console.log(Date.now(), start, end, percentage);
  }

  return Math.floor(Math.min(100, Math.max(0, percentage)));
};
