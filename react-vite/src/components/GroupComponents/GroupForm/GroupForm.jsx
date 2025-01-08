import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, useParams } from 'react-router-dom'; // Import useLocation
const sprout = 'https://i.postimg.cc/jdK73WSg/sprout.png';
import DeleteGroupModal from '../GroupModals/DeleteGroupModal';
import {thunkCreateGroup, thunkUpdateGroup, thunkDeleteGroup, thunkFetchGroup} from '../../../redux/group';
import { fetchUserFriends } from '../../../redux/user';
import {
	fetchInvitedFriends,
	createInvite,
	deleteInvite,
} from '../../../redux/invites';
import './GroupForm.css';

const GroupForm = ({ isEditMode }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation(); // Get data from route state
	const eventData = location.state?.eventData; // Get eventData from modal navigation
	// const groupData = location.state?.groupData; // Get eventData from modal navigation
	const { groupId } = useParams();

	const currentUser = useSelector((state) => state.session.user);
	const { group, loading, error } = useSelector((state) => state.group);
	const { friends } = useSelector((state) => state.user);

	const invitedFriends = useSelector((state) => state.invite || []); // Invited friends list

    const [tempSelectedFriends, setTempSelectedFriends] = useState([]); 
	const [description, setDescription] = useState('');
	const [setFriendsList] = useState([]);
	const [selectedFriends, setSelectedFriends] = useState([]);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [groupsId, setGroupsId] = useState(groupId || null);

	// **Fetch invited friends in edit mode**
	useEffect(() => {
		if (isEditMode) {
			dispatch(fetchInvitedFriends(groupId));
			dispatch(thunkFetchGroup(groupId));
		}
	}, [dispatch, isEditMode, groupId]);

	// **Set selected friends based on invited friends**
	useEffect(() => {
		if (isEditMode) {
			setSelectedFriends(invitedFriends.map((invite) => invite.friend_id));
			setTempSelectedFriends(invitedFriends.map((invite) => invite.friend_id))
			setDescription(group?.description || '');
		}
	}, [invitedFriends, isEditMode, group?.description]);

	useEffect(() => {
		if (!eventData) {
			alert('No event data provided. Redirecting to events page...');
			navigate('/events'); // Redirect if event data is missing
			return;
		}

		dispatch(fetchUserFriends()).then((friends) =>
			setFriendsList(friends || [])
		);
	}, [dispatch, eventData, navigate, setFriendsList]);

	const toggleFriendSelection = async (friend) => {

		const isAlreadySelected = tempSelectedFriends.includes(friend.id);

		if (isAlreadySelected) {
			setTempSelectedFriends((prev) => prev.filter(f => f !== friend.id));
		} else {
			setTempSelectedFriends((prev) => [...prev, friend.id])
		}
		// try {
		// 	let groupIdToUse = groupsId || groupId; // Prefer groupsId after group is auto-created

		// 	if (!groupIdToUse) {
		// 		const payload = {
		// 			description,
		// 			eventId: eventData.id,
		// 			ownerId: currentUser.id,
		// 		};

		// 		const savedGroup = await dispatch(thunkCreateGroup(payload));
		// 		if (savedGroup?.id) {
		// 			groupIdToUse = savedGroup.id;
		// 			setGroupsId(savedGroup.id);
		// 		}
		// 	}

		// 	const isAlreadySelected = selectedFriends.includes(friend.id);

		// 	if (isAlreadySelected) {
		// 		const inviteToDelete = invitedFriends.find(
		// 			(invite) => invite.friend_id === friend.id
		// 		);

		// 		if (inviteToDelete && inviteToDelete.id) {
		// 			await dispatch(deleteInvite(inviteToDelete.id));
		// 			setSelectedFriends((prev) =>
		// 				prev.filter((f) => f !== friend.id)
		// 			);
		// 		} else {
		// 			console.error('Invite not found or invite ID missing.');
		// 		}
		// 	} else {
		// 		const invitePayload = {
		// 			group_id: groupIdToUse,
		// 			user_id: currentUser.id,
		// 			friend_id: friend.id,
		// 			event_id: eventData.id,
		// 			going: null,
		// 		};

		// 		const newInvite = await dispatch(createInvite(invitePayload));

		// 		if (newInvite?.id) {
		// 			setSelectedFriends((prevSelectedFriends) => [
		// 				...prevSelectedFriends,
		// 				friend.id,
		// 			]);
		// 		} else {
		// 			console.error('Failed to add friend: invite ID is missing');
		// 		}
		// 	}
		// } catch (error) {
		// 	console.error('Failed to create invite:', error);
		// }
	};

	const handleSaveGroup = async (e) => {
		e.preventDefault();
		if (!eventData) {
			alert('Event data is missing!');
			return;
		}
		const payload = {
			description,
			eventId: eventData.id,
		};

		let groupIdToUse = groupsId || groupId; // Prefer groupsId after group is auto-created

		if (isEditMode) {
			await dispatch(thunkUpdateGroup({ ...payload, groupId }));
			// navigate(`/groups/${groupId}`);
		} else {
			const savedGroup = await dispatch(thunkCreateGroup(payload));
			if (savedGroup?.id) {
				setGroupsId(savedGroup.id);
				// navigate(`/groups/${savedGroup.id}`);
			} else {
				console.error('Failed to navigate: Group ID not found');
			}
		}


		await Promise.all(
			tempSelectedFriends.map(async (friendId) => {
				const isAlreadySelected = selectedFriends.includes(friendId)
				if (!isAlreadySelected) {
					const invitePayload = {
						group_id: groupIdToUse,
						user_id: currentUser.id,
						friend_id: friendId,
						event_id: eventData.id,
						going: null,
					};
					await dispatch(createInvite(invitePayload))
				}
			})
		);

		await Promise.all(
			selectedFriends.map(async (friendId) => {
				if (!tempSelectedFriends.includes(friendId)) {
					const inviteToDelete = invitedFriends.find(
						(invite) => invite.friend_id === friendId
					);
					if (inviteToDelete && inviteToDelete.id) {
						await dispatch(deleteInvite(inviteToDelete.id))
					}
				}
			})
		);

		navigate(`/groups/${groupIdToUse}`);
		setSelectedFriends(tempSelectedFriends);
	};

	const handleDeleteGroup = async () => {
		await dispatch(thunkDeleteGroup(groupId));
		navigate('/profile');
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<div className='group-form-page'>
			<div className='left-column'>
				<h2>
					{isEditMode
						? `Edit Group - ${eventData?.title || 'Event Title'}`
						: `Create Group - ${eventData?.title || 'Event Title'}`}
				</h2>
				<p>
					Hosted by:{' '}
					{currentUser
						? `${currentUser.first_name} ${currentUser.last_name}`
						: 'Loading...'}
				</p>
				<p>{`${eventData?.event_date} | ${eventData.start_time} - ${eventData?.end_time} | ${eventData?.categories}`}</p>
				<p>
					{eventData?.address}, {eventData?.city}, {eventData?.state}
				</p>
				<p>
					<a href={`/events/${eventData?.id}`} className='event-link'>
						Link to {eventData?.title} Event Page
					</a>
				</p>

				<div className='group-description'>
					<textarea
						id='description'
						placeholder='Add group description:'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						required
					/>
				</div>

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
										<span className='friend-name'>{`${friend.first_name} ${friend.last_name}`}</span>
									</div>
									<button
										className={`select-friend-button ${
											tempSelectedFriends.includes(friend.id)
												? 'selected'
												: ''
										}`}
										onClick={() => toggleFriendSelection(friend)}>
										{tempSelectedFriends.includes(friend.id)
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

			<div className='right-column'>
				<div className='event-header'>
					<img
						className='event-banner'
						src={eventData?.preview || sprout}
						alt='Event Banner'
					/>
				</div>

				<div className='group-buttons'>
					<button className='save-group-button' onClick={handleSaveGroup}>
						Save Group
					</button>
					<button
						onClick={() => navigate(`/groups/`)}
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
					eventName={eventData?.title || 'this event'}
				/>
			)}
		</div>
	);
};

export default GroupForm;
