import { render } from '@testing-library/react';
import { vi } from 'vitest';

import CountdownElement from './CountdownElement';

test('renders without crashing', () => {
  const { baseElement } = render(
    <CountdownElement
      countdown={{
        ref: '0-0-0-0-0',
        name: 'Testing',
        startDate: new Date(),
        endDate: new Date(),
      }}
      handleClick={vi.fn()}
      selectedRef={null}
    />
  );

  expect(baseElement).toBeDefined();
});
