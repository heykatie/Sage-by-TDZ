import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserEvents } from '../../../../redux/user';
import { useNavigate } from 'react-router-dom';
import './CreateGroupModal.css';
const sproutImage = 'https://i.postimg.cc/jdK73WSg/sprout.png';
import { useModal } from "../../../../context/Modal";

const CreateGroupModal = ({ onClose }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { events } = useSelector((state) => state.user);
	const [selectedEventId, setSelectedEventId] = useState('');
	const [selectedEvent, setSelectedEvent] = useState(null);

	const { closeModal } = useModal();

	// useEffect(() => {
	// 	dispatch(fetchUserEvents());
	// }, [dispatch]);

	useEffect(() => {
		dispatch(fetchUserEvents()).then((response) => {
			console.log('Fetched events:', response);
		});
	}, [dispatch]);

	// Handle event selection
	const handleEventChange = (e) => {
		const eventId = e.target.value;
		setSelectedEventId(eventId);
		const eventData = events.find((event) => event.id.toString() === eventId);
		setSelectedEvent(eventData || null);
	};

	// Handle "Invite Friends!" button
	const handleInviteFriends = () => {
		if (!selectedEvent) {
			alert('Please select an event before continuing.');
			return;
		}
		navigate('/groups/new', { state: { eventData: selectedEvent } });
		onClose();
	};

	// Close modal when clicking outside of it
	const handleBackgroundClick = (e) => {
		if (e.target.classList.contains('delete-modal')) {
			onClose(); // Close modal
		}
	};

	return (
		<div className='delete-modal' onClick={handleBackgroundClick}>
			<div className='delete-modal-content'>
			<div className='delete-modal-header'>
			<img
				src={sproutImage}
				alt='Sprout'
				className='sprout-icon-left'
			/>
				<h2>Create Group</h2>
			<img
				src={sproutImage}
				alt='Sprout'
				className='sprout-icon-right'
			/>
			</div>
				<div className='event-selection'>
					<label htmlFor='event-select'>
						Which event would you like to create a group for?
					</label>
					<select
						id='event-select'
						value={selectedEventId}
						onChange={handleEventChange}
						required>
						<option value=''>List of available events:</option>
						{events.map((event) => (
							<option key={event.id} value={event.id}>
								{event.title} - {event.event_date}
							</option>
						))}
					</select>
				</div>
				<button className='invite-button' onClick={handleInviteFriends}>
					Invite Friends!
				</button>
			</div>
		</div>
	);
};

export default CreateGroupModal;
