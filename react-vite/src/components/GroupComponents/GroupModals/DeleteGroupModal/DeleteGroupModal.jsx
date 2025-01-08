import './DeleteGroupModal.css';

const DeleteGroupModal = ({
	onConfirm,
	onCancel,
	eventName = 'this event',
}) => {
	return (
		<div className='delete-modal'>
			<div className='delete-modal-content'>
				<div className='delete-modal-header'>
					<h2>Delete Group</h2>
				</div>
				<p>{`Are you sure you want to delete group for ${eventName}?`}</p>
				<p className='warning-text'>This action cannot be undone.</p>
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
