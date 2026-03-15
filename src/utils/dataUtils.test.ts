import { Preferences } from '@capacitor/preferences';
import { vi } from 'vitest';

import { COUNTDOWN_SAVE_KEY } from '../constants/countdownConstants';

import * as DataUtils from './dataUtils';

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn().mockResolvedValue({ value: [] }),
    set: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue([]),
  },
}));

describe('Data Utils', () => {
  const testRef = '0000-1111-2222-3333-4444';
  const testName = 'TestName';
  const testStartDate = new Date('2 Jan 2026');
  const testEndDate = new Date('1 Jan 2026');
  const testCountdown = {
    ref: testRef,
    name: testName,
    endDate: testEndDate,
    startDate: testStartDate,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('saveCountdown', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({
      value: JSON.stringify([]),
    });

    vi.spyOn(crypto, 'randomUUID').mockReturnValueOnce(testRef);
    vi.setSystemTime(testStartDate);

    const createdCountdown = await DataUtils.saveCountdown(
      testName,
      testEndDate
    );
    expect(createdCountdown).toEqual(testCountdown);

    const call = vi.mocked(Preferences.set).mock.calls[0][0];
    expect(call.key).toBe(COUNTDOWN_SAVE_KEY);
    expect(JSON.parse(call.value)).toEqual([
      {
        ...testCountdown,
        startDate: testStartDate.toISOString(),
        endDate: testEndDate.toISOString(),
      },
    ]);
  });

  test('removeEvent', async () => {
    vi.mocked(Preferences.get).mockResolvedValueOnce({
      value: JSON.stringify([]),
    });

    await DataUtils.removeEvent(testRef);

    expect(Preferences.set).toHaveBeenCalled();
  });

  test('getCountdowns', async () => {
    vi.mocked(Preferences.get).mockResolvedValue({
      value: JSON.stringify([testCountdown]),
    });

    const countdowns = await DataUtils.getCountdowns();

    expect(countdowns).toEqual([testCountdown]);
    expect(Preferences.get).toHaveBeenCalled();
  });
});
