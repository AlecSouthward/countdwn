import type { CountdownData } from '../../types/countdownTypes';

import {
  formatDateForDisplay,
  getRelativeTimeUntilDate,
  getPercentageBetweenDates as percentageBetweenDates,
} from '../../utils/dateUtils';

type Props = { data: CountdownData };

const Countdown = ({ data }: Props) => (
  <div className="p-4 rounded-xl border-2 border-neutral-800 bg-neutral-900 text-neutral-100">
    <div className="flex w-full justify-between items-center mb-2">
      <span className="text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">
        {data.name}
      </span>
      <p className="self-end flex flex-col text-right gap-y-1 mb-0.5">
        <span className="text-md">
          {getRelativeTimeUntilDate(data.endDate)}
        </span>
        <span className="text-sm text-neutral-600">
          {formatDateForDisplay(data.endDate)}
        </span>
      </p>
    </div>

    <div className="overflow-hidden bg-neutral-800 w-full h-max rounded-md">
      <div
        className="bg-blue-400 h-1"
        style={{
          width: percentageBetweenDates(data.startDate, data.endDate) + '%',
        }}
      ></div>
    </div>
  </div>
);

export default Countdown;
