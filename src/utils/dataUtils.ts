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
export const getCountdowns = async (): Promise<
  Record<string, CountdownType>
> => {
  const countdownsString = await Preferences.get({ key: COUNTDOWN_SAVE_KEY });

  if (!countdownsString.value) {
    return {};
  }

  const savedCountdowns = JSON.parse(countdownsString.value);

  const typedCountdowns: Record<string, CountdownType> = {};
  for (const countdown of savedCountdowns) {
    typedCountdowns[countdown.ref] = {
      ...countdown,
      startDate: new Date(countdown.startDate),
      endDate: new Date(countdown.endDate),
    };
  }

  return typedCountdowns;
};

/**
 * @param ref The reference to the countdown data being deleted.
 * @see CountdownType
 */
export const removeCountdown = async (ref: string) => {
  const countdowns = await getCountdowns();

  delete countdowns[ref];

  saveCountdowns(Object.values(countdowns));
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
  countdowns[newCountdown.ref] = newCountdown;

  saveCountdowns(Object.values(countdowns));

  return newCountdown;
};

/**
 * @description Updates a countdown's data.
 * @param ref Existing countdown's ref.
 * @param name New countdown name.
 * @param endDate New countdown end date.
 * @returns Updated countdown.
 * @see CountdownType
 */
export const updateCountdown = async (
  ref: string,
  name: string,
  endDate: Date
) => {
  const countdowns = await getCountdowns();
  const existingCountdown = countdowns[ref];

  if (!existingCountdown) return;

  existingCountdown.name = name;
  existingCountdown.endDate = endDate;

  await saveCountdowns(Object.values(countdowns));

  return existingCountdown;
};
