import { DatePicker } from '@capacitor-community/date-picker';
import {
  CalendarIcon,
  PlusCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useState } from 'react';

type Props = { onCreate: (name: string, endDate: Date) => void };

const CreateNew = ({ onCreate }: Props) => {
  const [name, setName] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleDateSelect = async () => {
    try {
      const selectedDateData = await DatePicker.present({
        min: new Date().toISOString(),
        mode: 'date',
        // theme: 'dark',
      });
      console.log(selectedDateData);
      const selectedDate = new Date(selectedDateData.value);

      setEndDate(selectedDate);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 rounded-xl border-2 border-neutral-800 bg-neutral-900 flex flex-col gap-y-8 order-last">
      <div className="flex justify-between items-center gap-x-4">
        <input
          className="px-2 py-1 max-w-100 min-w-20 h-12 rounded-xl border-2 border-neutral-700 bg-neutral-800 text-neutral-100 text-xl focus:outline-none"
          type="text"
          placeholder="Name..."
          maxLength={16}
          minLength={2}
          onChange={(evt) => setName(evt.target?.value)}
        />

        <CalendarIcon
          className="stroke-neutral-100 w-12 h-12"
          onClick={handleDateSelect}
        />
      </div>

      <button
        className="flex justify-center bg-blue-400 py-2 rounded-lg mx-8 w-full min-w-30 max-w-80 h-12 self-center disabled:bg-red-400 transition-colors"
        disabled={!name || !endDate}
        onClick={() => onCreate(name!, endDate!)}
      >
        {!name || !endDate ? (
          <XCircleIcon className="stroke-neutral-100 w-8 h-8 self-center" />
        ) : (
          <PlusCircleIcon className="stroke-neutral-100 w-8 h-8 self-center" />
        )}
      </button>
    </div>
  );
};

export default CreateNew;
