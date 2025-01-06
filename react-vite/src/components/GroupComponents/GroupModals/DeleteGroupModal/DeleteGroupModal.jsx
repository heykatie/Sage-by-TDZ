import './DeleteGroupModal.css';

const DeleteGroupModal = ({ onConfirm, onCancel }) => {
	return (
		<div className='delete-modal'>
			<div className='delete-modal-content'>
				<p>Are you sure you want to delete this group?</p>
				<div className='modal-buttons'>
					<button className='confirm-delete' onClick={onConfirm}>
						Yes, Delete
					</button>
					<button className='cancel-delete' onClick={onCancel}>
						No, Go Back
					</button>
				</div>
			</div>
		</div>
	);
};

export default DeleteGroupModal;

