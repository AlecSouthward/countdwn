import { PlusCircleIcon } from '@heroicons/react/24/outline';

type Props = { onClick: () => void };

const CreateNewButton = ({ onClick }: Props) => (
  <button
    className="flex justify-center bg-blue-400 py-2 rounded-lg mx-8"
    onClick={onClick}
  >
    <PlusCircleIcon className="stroke-neutral-100 w-8 h-8" />
  </button>
);

export default CreateNewButton;
