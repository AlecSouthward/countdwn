import './CountdownElement.css';
import { IonIcon } from '@ionic/react';
import { create, trash } from 'ionicons/icons';

import { CountdownType } from '../../types/common';

import { cn } from '../../utils/classes';
import {
  getPercentageBetweenDates,
  getRelativeTimeUntilDate,
} from '../../utils/dateUtils';

type Props = {
  countdown: CountdownType;
  selectedRef: string | null;
  handleClick: () => void;
};

const CountdownElement = ({ countdown, selectedRef, handleClick }: Props) => {
  const isSelected = countdown.ref === selectedRef;
  const progressPercent = getPercentageBetweenDates(
    countdown.startDate,
    countdown.endDate
  );

  return (
    <button
      className={cn('element-container', isSelected ? 'active' : undefined)}
      onClick={handleClick}
    >
      <div className="info">
        <p className={cn(progressPercent === 100 ? 'complete' : undefined)}>
          {countdown.name ?? 'None provided.'}
        </p>

        <div className="date-info">
          <p
            className={cn(
              'time-until-info',
              progressPercent === 100
                ? 'complete'
                : progressPercent >= 90
                  ? 'near'
                  : undefined
            )}
          >
            {getRelativeTimeUntilDate(countdown.endDate)}
          </p>
          <p>{countdown.endDate.toLocaleDateString()}</p>
        </div>
      </div>

      <div className="progress-container">
        <div
          className={cn(
            'progress-bar',
            progressPercent === 100
              ? 'complete'
              : progressPercent >= 90
                ? 'near'
                : undefined
          )}
          style={{ width: progressPercent + '%' }}
        />
      </div>

      <div className="countdown-selected-section">
        <hr />

        <div className="countdown-edit-container">
          <button>
            <IonIcon md={create} />
            <span>Edit</span>
          </button>

          <button className="red">
            <IonIcon md={trash} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </button>
  );
};

export default CountdownElement;
