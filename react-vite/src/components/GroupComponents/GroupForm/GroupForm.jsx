import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom'; // Import useLocation
const sprout = 'https://i.postimg.cc/jdK73WSg/sprout.png';
import DeleteGroupModal from '../GroupModals/DeleteGroupModal';
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
import { createInvite, deleteInvite, fetchInvitedFriends} from '../../../redux/invites';
import './GroupForm.css';

const GroupForm = ({ isEditMode, groupData }) => {
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
	const [groupsId, setGroupsId] = useState(groupId || null); // Initially, groupId is null

	useEffect(() => {
		if (isEditMode) {
			dispatch(fetchInvitedFriends(groupId));
		}
	}, [dispatch, isEditMode, groupId]);

	// Select invited friends from Redux store
	const invitedFriends = useSelector((state) => state.invite || []);

	// Set selected friends based on invited friends
	useEffect(() => {
		if (isEditMode && invitedFriends.length) {
			setSelectedFriends(invitedFriends);
		}
	}, [invitedFriends, isEditMode]);

	useEffect(() => {
		if (!groupData) {
			const fetchGroupData = async () => {
				const response = await fetch(`/api/groups/${groupsId}`);
				const data = await response.json();
				setDescription(data.description || ''); // Populate the description
			};
			fetchGroupData(); // Fallback API fetch
		} else {
			setDescription(groupData.description || '');
		}
	}, [groupData, groupsId]);

	useEffect(() => {
		if (!eventData) {
			alert('No event data provided. Redirecting to events page...');
			navigate('/events'); // Redirect if event data is missing
			return;
		}
		console.log('KATIE', groupData)
		if (isEditMode && groupData) {
			setDescription(groupData.description || '');
			if (groupData.invitedFriends?.length) {
				setSelectedFriends(groupData.invitedFriends); // Set invited friends in edit mode
			}
		}

		dispatch(fetchUserFriends()).then((friends) =>
			setFriendsList(friends || [])
		);
		// if (friendsList) console.log(friendsList);
	}, [dispatch, isEditMode, groupData, eventData, navigate]);


	const toggleFriendSelection = async (friend) => {
		try {
			let groupIdToUse = groupsId || groupId; // Prefer groupsId after group is auto-created

			// If group has not been created, auto-create the group first
			if (!groupIdToUse) {
				const payload = {
					description,
					eventId: eventData.id, // Use event ID passed from modal
					ownerId: currentUser.id, // Add the current user's ID
				};

				const savedGroup = await dispatch(thunkCreateGroup(payload));
				if (savedGroup?.id) {
					groupIdToUse = savedGroup.id; // Correctly set the ID
					setGroupsId(savedGroup.id); // Update state to hold the correct group ID
				}
			}

			const isAlreadySelected = selectedFriends.some(
				(f) => f.id === friend.id
			);

			if (isAlreadySelected) {
				// Fetch invite for deletion
				const inviteToDelete = await fetch(
					`/api/invites/find?group_id=${groupIdToUse}&friend_id=${friend.id}`
				);

				const inviteData = await inviteToDelete.json();

				if (inviteData && inviteData.id) {
					await dispatch(deleteInvite(inviteData.id));
					setSelectedFriends((prev) =>
						prev.filter((f) => f.id !== friend.id)
					);
				} else {
					console.error('Invite not found or invite ID missing.');
				}

			} else {
				// Create the invite after group is created or if it already exists
				const invitePayload = {
					group_id: groupIdToUse,
					user_id: currentUser.id, // The ID of the group creator
					friend_id: friend.id, // The selected friend to invite
					event_id: eventData.id,
					going: null,
				};

				const newInvite = await dispatch(createInvite(invitePayload));

				// **Update selectedFriends after invite creation**
				if (newInvite?.id) {
					setSelectedFriends((prevSelectedFriends) => [
						...prevSelectedFriends,
						{ ...friend, invite_id: newInvite.id },
					]);
				} else {
					console.error('Failed to add friend: invite ID is missing');
				}
			}
		} catch (error) {
			console.error('Failed to create invite:', error);
		}
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
			await dispatch(thunkUpdateGroup({ ...payload, groupId }));
			navigate(`/groups/${groupId}`);
		} else {
			const savedGroup = await dispatch(thunkCreateGroup(payload));
			if (savedGroup?.id) {
				setGroupsId(savedGroup.id);
				navigate(`/groups/${savedGroup.id}`); // Use savedGroup's id to navigate
			} else {
				console.error('Failed to navigate: Group ID not found');
			}
		}
	};

	// Delete group
	const handleDeleteGroup = async () => {
		await dispatch(thunkDeleteGroup(groupId));
		navigate('/profile'); // or '/dashboard'
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

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
										src={friend.profile_pic || sprout}
										alt={`${friend.first_name}'s profile`}
										className='friend-profile-pic'
									/>
									<div className='friend-details'>
										<span className='friend-name'>
											{`${friend.first_name} ${friend.last_name}`}
										</span>
									</div>
									<button
										className={`select-friend-button ${
											selectedFriends.some((f) => f.id === friend.id)
												? 'selected'
												: ''
										}`}
										onClick={() => toggleFriendSelection(friend)}>
										{selectedFriends.some((f) => f.id === friend.id)
											? 'Remove'
											: 'Add'}
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
			{showDeleteModal && (
				<DeleteGroupModal
					onConfirm={handleDeleteGroup}
					onCancel={() => setShowDeleteModal(false)}
					eventName={eventData.title || 'this event'} // Pass event title
				/>
			)}
		</div>
	);
};

export default GroupForm;