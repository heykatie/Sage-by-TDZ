import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkFetchGroup } from '../../../redux/group';
import sprout from './../../../../dist/assets/sprout.png';
import './Group.css';

const Group = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { groupId } = useParams();
	const { group } = useSelector((state) => state.group);
	const currentUser = useSelector((state) => state.session.user);

	const [members, setMembers] = useState([]);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState('');

	// Fetch group members and group details
	useEffect(() => {
		if (groupId) {
			dispatch(thunkFetchGroup(groupId)); // Fetch the group data
		}
	}, [dispatch, groupId]);

	useEffect(() => {
		const fetchGroupMembers = async () => {
			try {
				const response = await fetch(`/api/groups/${groupId}/members`, {
					credentials: 'include',
				});
				const data = await response.json();
				if (response.ok) {
					setMembers(data.Members);
				} else {
					console.error('Failed to fetch members:', data.message);
				}
			} catch (error) {
				console.error('Error fetching group members:', error);
			}
		};

		// Fetch messages for the group
		const fetchMessages = async () => {
			try {
				const response = await fetch(`/api/groups/${groupId}/messages`, {
					credentials: 'include',
				});
				const data = await response.json();
				if (response.ok) {
					setMessages(data.messages || []);
				} else {
					console.error('Failed to fetch messages:', data.message);
				}
			} catch (error) {
				console.error('Error fetching messages:', error);
			}
		};

		fetchGroupMembers();
		fetchMessages();
	}, [groupId]);

	// Handle new message submission
	const handleSendMessage = async (e) => {
		e.preventDefault();
		if (!newMessage.trim()) return;

		try {
			const response = await fetch(`/api/groups/${groupId}/messages`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
				body: JSON.stringify({ message: newMessage }),
			});
			const data = await response.json();
			if (response.ok) {
				setMessages((prev) => [...prev, data]); // Add the new message
				setNewMessage(''); // Clear input
			} else {
				console.error('Failed to post message:', data.message);
			}
		} catch (error) {
			console.error('Error posting message:', error);
		}
	};

	if (!group) {
		return <p>Loading group details...</p>;
	}

	// Check if current user is the owner of the group
	const isOwner = currentUser?.id === group.owner_id;

	return (
		<div className='group-page'>
			<div className='event-header'>
				<img
					className='event-banner'
					src={group.event?.preview || sprout} // Use the event preview or default image
					alt='Event Banner'
				/>
			</div>
			<h2>{`${group.event?.title || 'Event Title'} Group`}</h2>
			<p>
				Hosted by: {`${group.owner?.first_name} ${group.owner?.last_name}`}
			</p>
			<p>{`${group.event?.event_date} | ${group.event?.start_time} | ${group.event?.categories}`}</p>
			<p>{group.event?.address}</p>
			<a href={`/events/${group.event?.id}`} className='event-link'>
				View Event Details
			</a>

			{/* Group Description */}
			<div className='group-description'>
				<h3>Group Description</h3>
				<p>{group.description || 'No description added yet.'}</p>
			</div>

			{/* Members Section */}
			<section className='members-section'>
				<h3>Group Members</h3>
				<div className='members-list'>
					{members.length ? (
						members.map((member) => (
							<div className='member-item' key={member.id}>
								<img
									src={member.profile_pic || sprout}
									alt={`${member.first_name}'s profile`}
									className='member-profile-pic'
								/>
								<span>{`${member.first_name} ${member.last_name}`}</span>
							</div>
						))
					) : (
						<p>No members in this group yet.</p>
					)}
				</div>
			</section>

			{/* Message Board Section */}
			<section className='message-board-section'>
				<h3>Message Board</h3>
				<div className='messages-list'>
					{messages.length ? (
						messages.map((message, index) => (
							<div className='message-item' key={index}>
								<strong>{message.first_name || 'Anonymous'}:</strong>{' '}
								<span>{message.message}</span>
							</div>
						))
					) : (
						<p>No messages yet. Start the conversation!</p>
					)}
				</div>

				{/* New Message Form */}
				<form className='new-message-form' onSubmit={handleSendMessage}>
					<input
						type='text'
						placeholder='Write a message...'
						value={newMessage}
						onChange={(e) => setNewMessage(e.target.value)}
					/>
					<button type='submit'>Send</button>
				</form>
			</section>

			{/* Navigation and Edit Group Buttons */}
			<div className='group-buttons'>
				<button
					onClick={() => navigate('/profile')}
					className='dashboard-button'>
					Back to Dashboard
				</button>
				<button
					onClick={() => navigate(`/events/${group.event?.id}`)}
					className='event-button'>
					View Event
				</button>
				{isOwner && (
					<button
						onClick={() =>
							navigate(`/groups/${groupId}/edit`, {
								state: { eventData: group.event },
							})
						}
						className='edit-group-button'>
						Edit Group
					</button>
				)}
			</div>
		</div>
	);
};

export default Group;
