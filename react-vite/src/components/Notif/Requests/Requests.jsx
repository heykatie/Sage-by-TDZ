import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import * as inviteActions from '../../redux/invites';
import {
	fetchCurrentUser,
	fetchUserEvents,
	fetchUserBadges,
	fetchUserFriends,
	fetchUserGroups,
} from '../../../redux/user'; // Ensure correct import path
// import Navigation from '../Navigation';
import './Requests.css';
import SentRequests from './SentRequests';

const RequestsPage = () => {
	const dispatch = useDispatch();
	const { profile, events, badges, friends, groups, status, error } =
		useSelector((state) => state.user);

	const [activeSection, setActiveSection] = useState('requests'); // Tracks active section

	// Fetch necessary data on component mount
	useEffect(() => {
		dispatch(fetchCurrentUser());
		dispatch(fetchUserEvents());
		dispatch(fetchUserBadges());
		dispatch(fetchUserFriends());
		dispatch(fetchUserGroups());
        // dispatch(inviteActions.fetchUserInvites());
        // dispatch(inviteActions.fetchGroupInvites());
	}, [dispatch]);

	// Loading and error handling
	if (status === 'loading') return <p>Loading...</p>;
	if (status === 'failed') return <p>{`Error: ${error}`}</p>;

	// Dynamic content rendering
	const renderSection = () => {
		switch (activeSection) {
			case 'invites':
				return (
					<section id='invites' className='invites'>
						<h3>Invites</h3>
						<div className='invite-grid'>
							{invites?.length > 0 ? (
								invites.map((invite, index) => (
									<div className='invite' key={index}>
										<img src={invite.url} alt={`Invite ${index}`} />
										<p>{invite.name}</p>
									</div>
								))
							) : (
								<p>No invites yet</p>
							)}
						</div>
					</section>
				);
			case 'requests':
				return (
					<section id='requests' className='requests'>
						<h3>Requests</h3>
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
								<p>No requests yet!</p>
							)}
						</ul>
					</section>
				);
			case 'sent':
				return (
					<SentRequests />
				);
			default:
				return null;
		}
	};

	return (
		<div className='requests-page'>
			{/* NavBar */}
			{/* <Navigation /> */}

			{/* User Info Section */}
			<section className='user-info'>
				<div className='profile-picture'>
					<img
						src={profile?.profile_pic || '/default-avatar.png'}
						alt='Profile'
					/>
					{/* <button onClick={() => setActiveSection('edit-profile')}>
						Edit Profile
					</button> */}
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
							className={activeSection === 'invites' ? 'active' : ''}
							onClick={() => setActiveSection('invited')}>
							Invites
						</button>
						<button
							className={activeSection === 'requests' ? 'active' : ''}
							onClick={() => setActiveSection('requests')}>
							Requests
						</button>
						<button
							className={activeSection === 'sent' ? 'active' : ''}
							onClick={() => setActiveSection('sent')}>
							Sent
						</button>
					</nav>
				</div>
			</section>

			{/* Dynamic Section */}
			{renderSection()}
		</div>
	);
};

export default RequestsPage;
