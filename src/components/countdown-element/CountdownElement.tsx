import './CountdownElement.css';

import { CountdownType } from '../../types/common';

import {
  getPercentageBetweenDates,
  getRelativeTimeUntilDate,
} from '../../utils/dateUtils';

type Props = { countdown: CountdownType };

const CountdownElement = ({ countdown }: Props) => {
  return (
    <div className="element-container">
      <div className="info">
        <p>{countdown.name ?? 'None provided.'}</p>

        <div className="date-info">
          <p className="time-until-info">
            {getRelativeTimeUntilDate(countdown.endDate)}
          </p>
          <p>{countdown.endDate.toLocaleDateString()}</p>
        </div>
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width:
              getPercentageBetweenDates(
                countdown.startDate,
                countdown.endDate
              ) + '%',
          }}
        />
      </div>
    </div>
  );
};

export default CountdownElement;
