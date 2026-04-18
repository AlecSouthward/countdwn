import { render } from '@testing-library/react';
import { vi } from 'vitest';

import { CountdownType } from '../../types/common';

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
      handleDeleteClick={(ref: string) => {
        throw new Error('Function not implemented. ' + ref);
      }}
      handleEditClick={(countdown: CountdownType) => {
        throw new Error('Function not implemented. ' + countdown.name);
      }}
    />
  );

  expect(baseElement).toBeDefined();
});
