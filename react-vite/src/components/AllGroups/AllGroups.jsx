import './AllGroups.css'; // Create or import the CSS file for styling
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
	fetchCurrentUser,
	fetchUserEvents,
	fetchUserBadges,
	fetchUserFriends,
	fetchUserGroups,
} from '../../redux/user';
import { fetchAllEvents } from '../../redux/event';

export default function AllGroups() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { profile, groups } = useSelector((state) => state.user);
	const events = useSelector((state) => state.events.events);
	const currentUser = useSelector((state) => state.session.user);

	const [activeSection, setActiveSection] = useState('groups');

	useEffect(() => {
		dispatch(fetchCurrentUser());
		dispatch(fetchUserGroups());
		dispatch(fetchAllEvents()); // Fetch all events for matching event IDs
	}, [dispatch]);

	if (!currentUser) navigate('/');

	const eventsArray = Object.values(events);

	return (
		<div className='all-groups'>
			<section className='user-info'>
				<div className='profile-picture'>
					<img
						src={profile?.profile_pic || '/default-avatar.png'}
						alt='Profile'
					/>
					<button
						className='edit-profile-button'
						onClick={() => setActiveSection('edit-profile')}>
						Edit Profile
					</button>
				</div>
				<div className='dashboard-title'>
					<h2>
						{profile?.first_name} {profile?.last_name} Dashboard
					</h2>
					<p>
						{profile?.city}, {profile?.state}
					</p>
					<nav>
						<button
							className={activeSection === 'badges' ? 'active' : ''}
							onClick={() => navigate('/profile')}>
							Dashboard
						</button>
						<button
							className={activeSection === 'groups' ? 'active' : ''}
							onClick={() => setActiveSection('groups')}>
							Groups
						</button>
					</nav>
				</div>
			</section>
			<h1>Your Groups</h1>
			<div className='group-list'>
				{groups.length > 0 ? (
					groups.map((group) => {
						// Find the matching event for this group
						const event = eventsArray.find(
							(e) => e.id === group.event_id
						);
						return (
							<div className='group-card' key={group.id}>
								<div className='group-image-container'>
									<img
										className='group-event-image'
										src={event?.preview || '/default-event.png'}
										alt={event?.title || 'Event Image'}
									/>
								</div>
								<h4 className='group-title'>
									{event?.title || 'No Event Title'}
								</h4>
								<p className='group-description'>
									{group.description || 'No description provided.'}
								</p>
								<p className='group-owner'>
									<strong>Owner:</strong>{' '}
									{group.owner_name || 'Unknown'}
								</p>
								<p className='group-members-count'>
									<strong>Members:</strong> {group.membersCount || 0}
								</p>
								<div className='group-members'>
									<strong>Members List:</strong>
									<ul>
										{group.members.length > 0 ? (
											group.members.map((member) => (
												<li key={member.id} className='member-item'>
													{member.name}
												</li>
											))
										) : (
											<li>No members yet.</li>
										)}
									</ul>
								</div>
								<div className='group-card-buttons'>
									<Link
										to={`/groups/${group.id}`}
										className='view-group-button'>
										View Group
									</Link>
									{group.owner_id === profile?.id && (
										<button
											className='edit-group-button'
											onClick={() =>
												navigate(`/groups/${group.id}/edit`, {
													state: { groupData: group },
												})
											}>
											Edit Group
										</button>
									)}
								</div>
							</div>
						);
					})
				) : (
					<p>You haven't joined any groups yet.</p>
				)}
			</div>
		</div>
	);
}
