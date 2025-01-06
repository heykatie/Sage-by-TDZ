import './AllGroups.css'; // Create a new CSS file for styling
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

export const groupTile = (group, event) => {
	return (
		<div className='group-tile' key={group?.id}>
			<Link to={`/groups/${group.id}`} className='group-link'>
				<img
					className='group-event-pic'
					src={event?.preview || '/default-event.png'}
					alt={event?.title || 'Event Image'}
				/>
				<h3 className='group-title'>{event?.title || 'No Event Title'}</h3>
				<p className='group-description'>
					{group.description || 'No description provided.'}
				</p>
				<p className='group-members-count'>
					<strong>Members:</strong> {group.membersCount || 0}
				</p>
			</Link>
		</div>
	);
};

export default function AllGroups() {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { profile, groups } = useSelector((state) => state.user);
	const events = useSelector((state) => state.events.events);
	const currentUser = useSelector((state) => state.session.user);

	const [activeSection, setActiveSection] = useState('groups');

	useEffect(() => {
		dispatch(fetchCurrentUser());
		dispatch(fetchUserEvents());
		dispatch(fetchUserBadges());
		dispatch(fetchUserFriends());
		dispatch(fetchUserGroups());
		dispatch(fetchAllEvents()); // Fetch all events for groups
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
							onClick={() => setActiveSection('badges')}>
							Badges
						</button>
						<button
							className={activeSection === 'events' ? 'active' : ''}
							onClick={() => setActiveSection('events')}>
							Events
						</button>
						<button
							className={activeSection === 'friends' ? 'active' : ''}
							onClick={() => setActiveSection('friends')}>
							Friends
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
			<div className='tile-container'>
				<div className='tiles'>
					{groups.length > 0 ? (
						groups.map((group) => {
							const event = eventsArray.find(
								(e) => e.id === group.event_id
							);
							return groupTile(group, event);
						})
					) : (
						<p>You haven't joined any groups yet.</p>
					)}
				</div>
			</div>
		</div>
	);
}
