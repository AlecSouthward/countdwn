import './CountdownElement.css';
import { IonIcon } from '@ionic/react';
import { create, trash } from 'ionicons/icons';

import { CountdownType } from '../../types/common';

import { cn } from '../../utils/classes';
import {
  formatDateForDisplay,
  getPercentageBetweenDates,
  getRelativeTimeUntilDate,
} from '../../utils/dateUtils';

type Props = {
  countdown: CountdownType;
  selectedRef: string | null;
  handleClick: () => void;
  handleDeleteClick: (ref: string) => void;
  handleEditClick: (countdown: CountdownType) => void;
};

const CountdownElement = ({
  countdown,
  selectedRef,
  handleClick,
  handleDeleteClick,
  handleEditClick,
}: Props) => {
  const isSelected = countdown.ref === selectedRef;
  const progressPercent = getPercentageBetweenDates(
    countdown.startDate,
    countdown.endDate
  );
  const isComplete = progressPercent === 100;

  return (
    <div
      className={cn('countdown-container', isComplete ? 'complete' : undefined)}
    >
      <button
        className={cn('element-container', isSelected ? 'active' : undefined)}
        onClick={handleClick}
      >
        <div className="info">
          <p className={cn(isComplete ? 'complete' : undefined)}>
            {countdown.name ?? 'None provided.'}
          </p>

          {!isSelected && (
            <div className="date-info">
              {!isComplete && (
                <p
                  className={cn(
                    'time-until-info',
                    isComplete
                      ? 'complete'
                      : progressPercent >= 90
                        ? 'near'
                        : undefined
                  )}
                >
                  {getRelativeTimeUntilDate(countdown.endDate)}
                </p>
              )}
              <p>{formatDateForDisplay(countdown.endDate)}</p>
            </div>
          )}
        </div>

        {!isSelected && !isComplete && (
          <div className="progress-container">
            <div
              className={cn(
                'progress-bar',
                isComplete
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
          <button
            className="selected-button"
            onClick={() => handleEditClick(countdown)}
          >
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
