import { render } from '@testing-library/react';

import CountdownElement from '../CountdownElement';

test('renders without crashing', () => {
  const { baseElement } = render(<CountdownElement />);

  expect(baseElement).toBeDefined();
});
