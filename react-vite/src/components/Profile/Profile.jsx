import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	fetchCurrentUser,
	fetchUserEvents,
	fetchUserBadges,
	fetchUserFriends,
	fetchUserGroups,
} from '../../redux/user'; // Ensure correct import path
import './Profile.css';
import { Link, useNavigate } from 'react-router-dom';
import AllFriends from '../AllFriends';
import { fetchAllEvents } from '../../redux/event.js';
import { RiLeafFill } from "react-icons/ri";
import EditProfileModal from '../EditProfileModal/EditProfileModal.jsx';
import OpenModalButton from '../OpenModalButton/OpenModalButton.jsx';
import { thunkUserRSVPs } from '../../redux/rsvp.js';
import { ConvertDate } from '../EventDetails/EventDetails';
import { ConvertTime } from '../ListEvents/ListEvents.jsx';

const ProfilePage = ({ profileState }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const badges = Object.values(useSelector(state=>state.user.badges));
	const { profile, groups, status, error } = useSelector((state) => state.user);
	let [activeSection, setActiveSection] = useState('badges'); // Tracks active section
	const [firstName, setFirstName] = useState(profile?.first_name);
	const [lastName, setLastName] = useState(profile?.last_name);
	const [email, setEmail] = useState(profile?.email);
	const [city, setCity] = useState(profile?.city);
	const [state, setState] = useState(profile?.state);
	const [address, setAddress] = useState(profile?.address);
	

	useEffect(() => {
		if(profileState) return setActiveSection(profileState)
	}, [profileState])

	// Fetch necessary data on component mount
	useEffect(() => {
		dispatch(fetchCurrentUser());
		dispatch(fetchUserEvents());
		dispatch(fetchUserBadges());
		dispatch(fetchUserFriends());
		dispatch(fetchUserGroups());
		dispatch(thunkUserRSVPs());
		dispatch(fetchAllEvents());
	}, [dispatch]);
	

	const events = Object.values(useSelector(state=>state.events.events))
	const rsvps = useSelector((state) => state.rsvp.userRsvps.rsvps);
	let rsvpArr;

	if(rsvps) rsvpArr = Object.values(rsvps);

	if (status === 'loading') return <p>Loading...</p>;
	if (status === 'failed') return <p>{`Error: ${error}`}</p>;

	

	const payload = {
		first_name: firstName,
		last_name: lastName,
		email,
		city,
		state,
		address
	}

	const handleSubmit = (event) => {
		event.preventDefault()
	}
	const Location = ({event}) => {
        if(event?.state === 'None') {
            return (<h2 className='city-state-toggle'>Virtual</h2>)
        }
        return (<h2 className='city-state-toggle'>{event?.city}, {event?.state}</h2>)
    }

	// Dynamic content rendering
	const renderSection = () => {
		switch (activeSection) {
			case 'badges':
				return (
					<section id='badges' className='badges-container'>
						<h3>Badges</h3>
						<div className='badge-grid'>
							{badges?.length > 0 ? (
								badges.map((badge, index) => (
									<div className='badge' key={index}>
										{/* <img src={badge.url} alt={badge.title} /> */}
										<RiLeafFill color='green' size='large'/>
										{badge.title}
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
							{rsvpArr?.length > 0 ? (
								rsvpArr.map((event) => (
									<li className='dashboard-events' key={event?.id}>
										<div className='li-event-list' id='upcoming'>
											<Link to={`/events/${event?.id}`}>
												<div className='li-event-title'>{event?.title}</div>
												<div className='li-event-image'>
													<img
														src={event?.preview}
														alt={event?.title}
													/>
												</div>
												<div className='li-event-categories'>
													{event?.categories
														.split(',')
														.map((category, index) => (
															<li
																className='category'
																key={`${event?.id}-category-${index}`}>
																<p>{category.trim()}</p>
															</li>
														))}
												</div>
												<div className='li-event-location-time'>
													<div className='city-date'>
														<h2><Location event={event} /></h2>
														<h3>Date: {ConvertDate(event?.event_date)}</h3>
													</div>
													<div className='start-end-time'>
														<h3>Start: {ConvertTime(event?.start_time)}</h3>
														<h3>End: {ConvertTime(event?.end_time)}</h3>
													</div>
												</div>
												<p className='li-event-description'>{event?.description}</p>
											</Link>
										</div>
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
						<AllFriends />
				
			);
			case 'edit-profile':
				return (
					<section id='edit-profile' className='edit-profile'>
					<h3>Edit Profile</h3>
					<form onSubmit={handleSubmit}>
						<div className='form-info'>
						<div>
							<label>First Name</label>
							<input
								type='text'
								value={profile?.first_name || ''}
								onChange={(e) => setFirstName(e.target.value)}
							/>
						</div>
						<div>
							<label>Last Name</label>
							<input
								type='text'
								value={lastName|| ''}
								onChange={(e) => setLastName(e.target.value)}
							/>
						</div>
						<div>
							<label>Email</label>
							<input
								type='email'
								value={email || ''}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label>City</label>
							<input
							type='text'
							value={city || ''}
							onChange={(e) => setCity(e.target.value)}
							/>
						</div>
						<div>
							<label>State</label>
							<input
								type='text'
								value={state || ''}
								onChange={(e) => setState(e.target.value)}
							/>
						</div>
						<div>
							<label>Address</label>
							<input
								type='text'
								value={address || ''}
								onChange={(e) => setAddress(e.target.value)}
							/>
						</div>
						</div>
					<div className='form-buttons'>
						<OpenModalButton
						buttonText="Save Changes"
						modalComponent={<EditProfileModal payload={payload} />}
						onButtonClick
						onModalClose
						/>
						<OpenModalButton
						buttonText="Delete Profile"
						modalComponent={<EditProfileModal payload={payload} />}
						onButtonClick
						onModalClose
						/>
					</div>
					</form>
					</section>
				);
			case 'groups':
				return (
				<section id='groups' className='groups-section'>
					<h3>Your Groups</h3>
					<div className='group-list'>
					{groups?.length > 0 ? (
						groups.map((group) => {
							// Find event details using event_id
							const event = events.find(
								(e) => e.id === group.event_id
							);
							return (
								<div className='group-card' key={group?.id}>
									<div className='group-image-container'>
										<img
											className='group-event-image'
											src={
												event?.preview || '/default-event.png'
											}
											alt={event?.event_title || 'Event Image'}
										/>
									</div>
									<h4 className='group-title'>
										{event?.title || 'No Event Title'}
									</h4>
									<p className='group-description'>
										{group?.description ||
											'No description provided.'}
									</p>
									<p className='group-owner'>
										<strong>Owner:</strong>{' '}
										{group?.owner_name || 'Unknown'}
									</p>
									<p className='group-members-count'>
										<strong>Members:</strong>{' '}
										{group?.membersCount}
									</p>
									<div className='group-members'>
										<strong>Members List:</strong>
										<ul>
											{group?.members.length > 0 ? (
												group?.members.map((member) => (
													<li
														key={member.id}
														className='member-item'>
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
											to={`/groups/${group?.id}`}
											className='view-group-button'>
											View Group
										</Link>
										{group?.owner_id === profile?.id && (
											<button
												className='edit-group-button'
												onClick={() =>
													navigate(
														`/groups/${group?.id}/edit`,
														{
															state: {
																eventData: event,
																groupData: group,
															},
														}
													)
												}>
												Edit Group
											</button>
										)}
									</div>
								</div>
							);
						})
					) : (
						<p>You haven&apos;t joined any groups yet.</p>
					)}
					</div>
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
