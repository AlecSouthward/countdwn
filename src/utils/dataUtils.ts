import { Preferences } from '@capacitor/preferences';

import type { CountdownType } from '../types/common';

import { COUNTDOWN_SAVE_KEY } from '../constants/countdownConstants';

const saveCountdowns = async (countdowns: CountdownType[]) => {
  await Preferences.set({
    key: COUNTDOWN_SAVE_KEY,
    value: JSON.stringify(countdowns),
  });
};

/**
 * @returns All saved countdown data.
 * @see CountdownType
 */
export const getCountdowns = async (): Promise<CountdownType[]> => {
  const countdownsString = await Preferences.get({ key: COUNTDOWN_SAVE_KEY });

  if (!countdownsString.value) {
    return [];
  }

  const savedCountdowns = JSON.parse(countdownsString.value);

  const typedCountdowns: CountdownType[] = [];
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
 * @see CountdownType
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
 * @returns Created countdown.
 * @see CountdownType
 */
export const saveCountdown = async (name: string, endDate: Date) => {
  const newCountdown = {
    ref: crypto.randomUUID(),
    name,
    startDate: new Date(),
    endDate,
  };

  const countdowns = await getCountdowns();
  countdowns.push(newCountdown);

  Preferences.set({
    key: COUNTDOWN_SAVE_KEY,
    value: JSON.stringify(countdowns),
  });

  return newCountdown;
};
