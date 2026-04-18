import './DeleteModal.css';

type Props = {
  handleDeleteConfirmClick: () => void;
  handleDeleteCancelClick: () => void;
};

const DeleteModal = ({
  handleDeleteConfirmClick,
  handleDeleteCancelClick,
}: Props) => {
  return (
    <div className="delete-modal-container">
      <div className="delete-modal">
        <h2>Delete the countdown?</h2>
        <div className="delete-buttons-container">
          <button className="confirm-button" onClick={handleDeleteConfirmClick}>
            Delete
          </button>
          <button onClick={handleDeleteCancelClick}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
