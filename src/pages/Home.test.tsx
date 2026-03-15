import { render } from '@testing-library/react';

import Home from './Home';

describe('Home', () => {
  test('renders without crashing', () => {
    const { baseElement } = render(
      <Home countdowns={[]} onCountdownCreated={() => {}} />
    );

    expect(baseElement).toBeDefined();
  });
});
