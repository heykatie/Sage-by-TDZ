import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchCurrentUser,
	fetchUserEvents,
	fetchUserBadges,
	fetchUserFriends,
	fetchUserGroups,
} from '../../redux/user'; // Ensure correct import path
// import Navigation from '../Navigation';
import './ProfilePage.css';

const ProfilePage = () => {
	const dispatch = useDispatch();
	const { profile, events, badges, friends, groups, status, error } =
		useSelector((state) => state.user);

	const [activeSection, setActiveSection] = useState('badges'); // Tracks active section

	// Fetch necessary data on component mount
	useEffect(() => {
		dispatch(fetchCurrentUser());
		dispatch(fetchUserEvents());
		dispatch(fetchUserBadges());
		dispatch(fetchUserFriends());
		dispatch(fetchUserGroups());
	}, [dispatch]);

	// Loading and error handling
	if (status === 'loading') return <p>Loading...</p>;
	if (status === 'failed') return <p>{`Error: ${error}`}</p>;

	// Dynamic content rendering
	const renderSection = () => {
		switch (activeSection) {
			case 'badges':
				return (
					<section id='badges' className='badges'>
						<h3>Badges</h3>
						<div className='badge-grid'>
							{badges?.length > 0 ? (
								badges.map((badge, index) => (
									<div className='badge' key={index}>
										<img src={badge.url} alt={`Badge ${index}`} />
										<p>{badge.name}</p>
									</div>
								))
							) : (
								<p>No badges yet</p>
							)}
						</div>
					</section>
				);
			case 'events':
				return (
					<section id='events' className='events'>
						<h3>Upcoming Events</h3>
						<ul>
							{events?.length > 0 ? (
								events.map((event) => (
									<li key={event.id}>
										<h4>{event.title}</h4>
										<p>Date: {event.eventDate}</p>
										<p>
											Location: {event.city}, {event.state}
										</p>
									</li>
								))
							) : (
								<p>No upcoming events</p>
							)}
						</ul>
					</section>
				);
			case 'friends':
				return (
					<section id='friends' className='friends'>
						<h3>Friends</h3>
						<ul>
							{friends?.length > 0 ? (
								friends.map((friend) => (
									<li key={friend.id}>
										<h4>
											{friend.firstName} {friend.lastName}
										</h4>
										<p>{friend.username}</p>
									</li>
								))
							) : (
								<p>No friends yet</p>
							)}
						</ul>
					</section>
				);
			case 'groups':
				return (
					<section id='groups' className='groups'>
						<h3>Groups</h3>
						<ul>
							{groups?.length > 0 ? (
								groups.map((group) => (
									<li key={group.id}>
										<h4>{group.name}</h4>
										<p>Members: {group.membersCount}</p>
									</li>
								))
							) : (
								<p>No groups yet</p>
							)}
						</ul>
					</section>
				);
			case 'edit-profile':
				return (
					<section id='edit-profile' className='edit-profile'>
						<h3>Edit Profile</h3>
						<form>
							<div>
								<label>First Name</label>
								<input
									type='text'
									defaultValue={profile?.first_name || ''}
								/>
							</div>
							<div>
								<label>Last Name</label>
								<input
									type='text'
									defaultValue={profile?.last_name || ''}
								/>
							</div>
							<div>
								<label>Email</label>
								<input
									type='email'
									defaultValue={profile?.email || ''}
								/>
							</div>
							<div>
								<label>City</label>
								<input type='text' defaultValue={profile?.city || ''} />
							</div>
							<div>
								<label>State</label>
								<input
									type='text'
									defaultValue={profile?.state || ''}
								/>
							</div>
							<div>
								<label>Address</label>
								<input
									type='text'
									defaultValue={profile?.address || ''}
								/>
							</div>
							<button type='submit'>Save Changes</button>
						</form>
					</section>
				);
			default:
				return null;
		}
	};

	return (
		<div className='profile-page'>
			{/* NavBar */}
			{/* <Navigation /> */}

			{/* User Info Section */}
			<section className='user-info'>
				<div className='profile-picture'>
					<img
						src={profile?.profile_pic || '/default-avatar.png'}
						alt='Profile'
					/>
					<button onClick={() => setActiveSection('edit-profile')}>
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

			{/* Dynamic Section */}
			{renderSection()}
		</div>
	);
};

export default ProfilePage;
