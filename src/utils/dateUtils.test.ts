import { vi } from 'vitest';

import * as DateUtils from './dateUtils';

describe('Date Utils', () => {
  test('formatDateForDisplay', () => {
    const date = new Date('01-01-2026');
    const formattedDate = DateUtils.formatDateForDisplay(date);

    expect(formattedDate).toBe('01 Jan 2026');
  });

  describe('getPercentageBetweenDates', () => {
    test('50', () => {
      vi.setSystemTime('2 Jan 2026');

      const startDate = new Date('1 Jan 2026');
      const endDate = new Date('3 Jan 2026');

      const percentage = DateUtils.getPercentageBetweenDates(
        startDate,
        endDate
      );

      expect(percentage).toBe(50);
    });

    test('100 (clamped)', () => {
      vi.setSystemTime('2 Jan 2026');

      const startDate = new Date('3 Jan 2026');
      const endDate = new Date('1 Jan 2026');

      const percentage = DateUtils.getPercentageBetweenDates(
        startDate,
        endDate
      );

      expect(percentage).toBe(100);
    });
  });

  describe('getRelativeTimeUntilDate', () => {
    test('in the past', () => {
      vi.setSystemTime('02-01-2026');
      const date = new Date('01-01-2026');

      const percentage = DateUtils.getRelativeTimeUntilDate(date);

      expect(percentage).toBe('in the past');
    });

    test('today', () => {
      vi.setSystemTime('1 Jan 2026');
      const date = new Date('1 Jan 2026');

      const percentage = DateUtils.getRelativeTimeUntilDate(date);

      expect(percentage).toBe('today');
    });

    test('tomorrow', () => {
      vi.setSystemTime('01-01-2026');
      const date = new Date('01-02-2026');

      const percentage = DateUtils.getRelativeTimeUntilDate(date);

      expect(percentage).toBe('tomorrow');
    });

    test('3 days left', () => {
      vi.setSystemTime('01-01-2026');
      const date = new Date('01-04-2026');

      const percentage = DateUtils.getRelativeTimeUntilDate(date);

      expect(percentage).toBe('3 days left');
    });

    test('1 month left', () => {
      vi.setSystemTime('1 Jan 2026');
      const date = new Date('1 Feb 2026');

      const percentage = DateUtils.getRelativeTimeUntilDate(date);

      expect(percentage).toBe('1 month left');
    });

    test('2 months left', () => {
      vi.setSystemTime('1 Jan 2026');
      const date = new Date('15 Feb 2026');

      const percentage = DateUtils.getRelativeTimeUntilDate(date);

      expect(percentage).toBe('2 months left');
    });

    test('1 year left', () => {
      vi.setSystemTime('1 Jan 2026');
      const date = new Date('1 Jan 2027');

      const percentage = DateUtils.getRelativeTimeUntilDate(date);

      expect(percentage).toBe('1 year left');
    });

    test('2 years left', () => {
      vi.setSystemTime('1 Jan 2026');
      const date = new Date('1 Jan 2028');

      const percentage = DateUtils.getRelativeTimeUntilDate(date);

      expect(percentage).toBe('2 years left');
    });
  });
});
