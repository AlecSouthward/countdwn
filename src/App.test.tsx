import { act, render } from '@testing-library/react';

import App from './App';

describe('App', () => {
  test('renders without crashing', async () => {
    await act(async () => {
      render(<App />);
    });
  });
});
