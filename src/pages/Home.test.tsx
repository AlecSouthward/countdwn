import { render } from '@testing-library/react';

import Home from './Home';

describe('Home', () => {
  test('renders without crashing', () => {
    const { baseElement } = render(
      <Home
        countdowns={[]}
        handleCreateCountdown={() => {}}
        handleEditCountdown={() => {}}
        handleDeleteCountdown={() => {}}
      />
    );

    expect(baseElement).toBeDefined();
  });
});
