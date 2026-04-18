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
  handleDeleteClick: (ref: string) => void;
};

const CountdownElement = ({
  countdown,
  selectedRef,
  handleClick,
  handleDeleteClick,
}: Props) => {
  const isSelected = countdown.ref === selectedRef;
  const progressPercent = getPercentageBetweenDates(
    countdown.startDate,
    countdown.endDate
  );

  return (
    <div className="countdown-container">
      <button
        className={cn('element-container', isSelected ? 'active' : undefined)}
        onClick={handleClick}
      >
        <div className="info">
          <p className={cn(progressPercent === 100 ? 'complete' : undefined)}>
            {countdown.name ?? 'None provided.'}
          </p>

          {!isSelected && (
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
          )}
        </div>

        {!isSelected && (
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
        )}
      </button>

      {isSelected && (
        <>
          <button className="selected-button">
            <IonIcon md={create} />
            <span>Edit</span>
          </button>

          <button
            className="selected-button red"
            onClick={() => handleDeleteClick(countdown.ref)}
          >
            <IonIcon md={trash} />
            <span>Delete</span>
          </button>
        </>
      )}
    </div>
  );
};

export default CountdownElement;
