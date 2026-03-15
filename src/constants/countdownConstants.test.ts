import { describe, expect, test } from 'vitest';

import * as CountdownConstants from './countdownConstants';

describe('Countdown Constants', () => {
  test('COUNTDOWN_SAVE_KEY', () => {
    expect(CountdownConstants.COUNTDOWN_SAVE_KEY).toBeDefined();
  });
});
