import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom'; // Import useLocation
// import {
// 	CreateGroupModal,
// 	DeleteGroupModal,
// 	RemoveFriendModal,
// } from '../GroupModals';
import {
	thunkCreateGroup,
	thunkUpdateGroup,
	thunkDeleteGroup,
} from '../../../redux/group';
import { fetchUserFriends } from '../../../redux/user';
import sprout from '../../../../dist/assets/sprout.png';
import GroupForm from './GroupForm.css'

const GroupFormPage = ({ isEditMode, groupData }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation(); // Get data from route state
	const eventData = location.state?.eventData; // Get eventData from modal navigation
	const { groupId } = useParams();

	const currentUser = useSelector((state) => state.session.user);
	const { loading, error } = useSelector((state) => state.group); // group,
	const { friends } = useSelector((state) => state.user); // events,

	const [description, setDescription] = useState('');
	const [friendsList, setFriendsList] = useState([]);
	const [selectedFriends, setSelectedFriends] = useState([]);
	// const [showRemoveModal, setShowRemoveModal] = useState(false);
	// const [friendToRemove, setFriendToRemove] = useState(null);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	useEffect(() => {
		if (!eventData) {
			alert('No event data provided. Redirecting to events page...');
			navigate('/events'); // Redirect if event data is missing
			return;
		}
		if (isEditMode && groupData) {
			setDescription(groupData.description || '');
			setSelectedFriends(groupData.invitedFriends || []);
		}
		dispatch(fetchUserFriends()).then((friends) =>
			setFriendsList(friends || [])
		);
		if (friendsList) console.log(friendsList);
	}, [dispatch, isEditMode, groupData, eventData, navigate]);

	// Toggle friend selection
	const toggleFriendSelection = (friend) => {
		setSelectedFriends((prev) =>
			prev.includes(friend)
				? prev.filter((f) => f !== friend)
				: [...prev, friend]
		);
	};

	const handleSaveGroup = async (e) => {
		e.preventDefault();
		if (!eventData) {
			alert('Event data is missing!');
			return;
		}
		const payload = {
			description,
			eventId: eventData.id, // Use event ID passed from modal
			// ownerId: currentUser.id,
		};
		if (isEditMode) {
			await dispatch(
				thunkUpdateGroup({ ...payload, groupId: groupData.id })
			);
			navigate(`/groups/${groupId}`);
		} else {
			const savedGroup = await dispatch(thunkCreateGroup(payload));
			if (savedGroup?.id) {
				navigate(`/groups/${savedGroup.id}`); // Use savedGroup's id to navigate
			} else {
				console.error('Failed to navigate: Group ID not found');
			}
		}
	};

	// Delete group
	const handleDeleteGroup = async () => {
		await dispatch(thunkDeleteGroup(groupId));
		navigate('/events');
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	console.log(eventData);

return (
	<div className='group-form-page'>
		{/* Left Column: Group Details and Friends */}
		<div className='left-column'>
			<h2>
				{isEditMode
					? `Edit Group - ${eventData.title || 'Event Title'}`
					: `Create Group - ${eventData.title || 'Event Title'}`}
			</h2>
			<p>
				Hosted by:{' '}
				{currentUser
					? `${currentUser.first_name} ${currentUser.last_name}`
					: 'Loading...'}
			</p>
			<p>{`${eventData.event_date} | ${eventData.start_time} - ${eventData.end_time} | ${eventData.categories}`}</p>
			<p>
				{eventData.address} {eventData.city}, {eventData.state}
			</p>
			<p>
				<a href={`/events/${eventData.id}`} className='event-link'>
					Link to {eventData.title} Event Page
				</a>
			</p>

			{/* Group description */}
			<div className='group-description'>
				<textarea
					id='description'
					placeholder='Add group description:'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					required
				/>
			</div>

			{/* Friends Section */}
			<section className='friends-section'>
				<h3>{isEditMode ? 'Friends Invited' : 'Invite Friends!'}</h3>
				<div className='friends-list'>
					{friends.length ? (
						friends.map((friend) => (
							<div className='friend-item' key={friend.id}>
								<img
									src={friend.profile_pic}
									alt={`${friend.first_name}'s profile`}
									className='friend-profile-pic'
								/>
								<span>{`${friend.first_name} ${friend.last_name}`}</span>
								<button
									className={`select-friend-button ${
										selectedFriends.includes(friend) ? 'selected' : ''
									}`}
									onClick={() => toggleFriendSelection(friend)}>
									{selectedFriends.includes(friend) ? 'Remove' : 'Add'}
								</button>
							</div>
						))
					) : (
						<p>No friends to display. Invite friends to connect!</p>
					)}
				</div>
			</section>
		</div>

		{/* Right Column: Banner and Buttons */}
		<div className='right-column'>
			<div className='event-header'>
				<img
					className='event-banner'
					src={eventData.preview || sprout}
					alt='Event Banner'
				/>
			</div>

			{/* Save and Delete Buttons */}
			<div className='group-buttons'>
				<button className='save-group-button' onClick={handleSaveGroup}>
					Save Group
				</button>
				<button
					onClick={() => navigate(`/events/${eventData.id}`)}
					className='cancel-button'>
					Cancel
				</button>
				{isEditMode && (
					<button
						className='delete-group-button'
						onClick={() => setShowDeleteModal(true)}>
						Delete Group
					</button>
				)}
			</div>
		</div>
	</div>
);
};

export default GroupFormPage;

{/* Delete Modal
{showDeleteModal && (
	<div className='delete-modal'>
		<div className='delete-modal-content'>
			<p>Are you sure you want to delete this group?</p>
			<div className='modal-buttons'>
				<button
					className='confirm-delete'
					onClick={handleDeleteGroup}>
					Yes, Delete
				</button>
				<button
					className='cancel-delete'
					onClick={() => setShowDeleteModal(false)}>
					No, Go Back
				</button>
			</div>
		</div>
	</div>
)} */}