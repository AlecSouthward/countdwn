import { Preferences } from '@capacitor/preferences';

import type { CountdownData } from '../types/common';

import { COUNTDOWN_SAVE_KEY } from '../constants/common';

const saveCountdowns = async (countdowns: CountdownData[]) => {
  await Preferences.set({
    key: COUNTDOWN_SAVE_KEY,
    value: JSON.stringify(countdowns),
  });
};

/**
 * @returns All saved countdown data.
 * @see CountdownData
 */
export const getCountdowns = async (): Promise<CountdownData[]> => {
  const countdownsString = await Preferences.get({ key: COUNTDOWN_SAVE_KEY });

  if (!countdownsString.value) {
    return [];
  }

  const savedCountdowns = JSON.parse(countdownsString.value);

  const typedCountdowns: CountdownData[] = [];
  for (const countdown of savedCountdowns) {
    typedCountdowns.push({
      ...countdown,
      startDate: new Date(countdown.startDate),
      endDate: new Date(countdown.endDate),
    });
  }

  return typedCountdowns;
};

/**
 * @param countdownRef The reference to the countdown data being deleted.
 * @see CountdownData
 */
export const removeEvent = async (countdownRef: string) => {
  const countdowns = await getCountdowns();

  const filteredCountdowns = countdowns.filter(
    (countdown) => countdown.ref !== countdownRef
  );

  saveCountdowns(filteredCountdowns);
};

/**
 * @description Saves countdown data to Capacitor preferences.
 * @param countdown Will be assigned a random UUID, so an empty `ref` is recommended.
 * @see CountdownData
 */
export const saveCountdown = async (countdown: CountdownData) => {
  const countdowns = await getCountdowns();

  countdown.ref = crypto.randomUUID();

  countdowns.push(countdown);

  Preferences.set({
    key: COUNTDOWN_SAVE_KEY,
    value: JSON.stringify(countdowns),
  });
};
