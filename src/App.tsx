import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

import type { CountdownData } from './types/countdownTypes';

import Countdown from './components/countdown/Countdown';
import CreateNew from './components/countdown/CreateNew';
import CreateNewButton from './components/countdown/CreateNewButton';
import { getCountdowns, saveCountdown } from './data/countdownData';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateVisible, setIsCreateVisible] = useState(false);
  const [countdowns, setCountdowns] = useState<CountdownData[]>([]);

  useEffect(() => {
    const testSaving = async () => {
      setIsLoading(true);

      // await Preferences.clear();
      // await saveCountdown({
      //   name: 'Event 1',
      //   startDate: new Date('1/1/2026'),
      //   endDate: new Date('7/10/2026'),
      //   ref: '',
      // });
      // await saveCountdown({
      //   name: 'Event 2',
      //   startDate: new Date('1/1/2026'),
      //   endDate: new Date('5/7/2026'),
      //   ref: '',
      // });
      // await saveCountdown({
      //   name: 'Event 3',
      //   startDate: new Date('1/1/2026'),
      //   endDate: new Date('2/25/2026'),
      //   ref: '',
      // });

      const savedCountdowns = await getCountdowns();
      setCountdowns(savedCountdowns);

      setIsLoading(false);
    };

    testSaving();
  }, [isCreateVisible]);

  return (
    <div className="m-4 p-4 gap-y-6 flex flex-col">
      {isLoading ? (
        <ArrowPathIcon className="stroke-blue-400 w-16 h-16 animate-spin absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]" />
      ) : (
        <>
          {countdowns.map((countdownData) => (
            <Countdown key={countdownData.ref} data={countdownData} />
          ))}

          {isCreateVisible ? (
            <CreateNew
              onCreate={async (name, endDate) => {
                await saveCountdown({
                  name,
                  startDate: new Date(),
                  endDate,
                  ref: '',
                });

                setIsCreateVisible(false);
              }}
            />
          ) : (
            <CreateNewButton onClick={() => setIsCreateVisible(true)} />
          )}
        </>
      )}
    </div>
  );
};

export default App;
