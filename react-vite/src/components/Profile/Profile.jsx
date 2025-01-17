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
import DeleteProfileModal from '../DeleteProfileModal/DeleteProfileModal.jsx';
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

	const currentDate = new Date();

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

	if(rsvps) rsvpArr = Object.values(rsvps).filter(e=>new Date(e?.event_date)>currentDate);

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
            return (<span className='city-state-toggle'>Virtual</span>)
        }
        return (<span className='city-state-toggle'>{event?.city}, {event?.state}</span>)
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
										{badge?.title}
										<p>{badge?.name}</p>
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
						<p>You have RSVPd &apos;Yes&apos; to the following events:</p>
						<ul className='dashboard-upcoming'>
							{rsvpArr?.length > 0 ? (
								rsvpArr.map((event) => (
									<li className='dashboard-events' key={event?.id}>
										<div className='group-card' id='upcoming'>
											<Link to={`/events/${event?.id}`}>
												<div className='li-event-title'>{event?.title}</div>
												<div className='group-image-container'>
													<img
													className='group-event-image'
													src={event?.preview}
													alt={event?.title}
													/>
												</div>
												<div className='li-event-categories'>
													{event?.categories
														.split(',')
														.map((category, index) => (
															<span
																className='category'
																key={`${event?.id}-category-${index}`}>
																<p>{category.trim()}</p>
															</span>
														))}
												</div>
												<div className='li-event-location-time'>
													<div className='city-date'>
														<b><h2><Location event={event} /></h2></b>
														<h3>Date: <b>{ConvertDate(event?.event_date)}</b></h3>
													</div>
													<div className='start-end-time'>
														<h3>Start: <b>{ConvertTime(event?.start_time)}</b></h3>
														<h3>End: <b>{ConvertTime(event?.end_time)}</b></h3>
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
					<div className='dash-friend-tiles'>
						<AllFriends />
					</div>
			);
			case 'edit-profile':
				return (
					<section id='edit-profile' className='edit-profile'>
					<h3>Edit Profile</h3>
					<form onSubmit={handleSubmit}>
						<div className='form-info' id='edit-profile'>
							<div className='form-titles-labels'>
								<div>
									<label>First Name</label>
									<input
										type='text'
										defaultValue={profile?.first_name ? profile?.first_name : ''}
										onChange={(e) => setFirstName(e.target.value)}
									/>
								</div>
								<div>
									<label>Last Name</label>
									<input
										type='text'
										defaultValue={profile?.last_name ? profile?.last_name : ''}
										onChange={(e) => setLastName(e.target.value)}
									/>
								</div>
								<div>
									<label>Email</label>
									<input
										type='email'
										defaultValue={profile?.email ? profile?.email : ''}
										onChange={(e) => setEmail(e.target.value)}
									/>
								</div>
								<div>
									<label>City</label>
									<input
										type='text'
										defaultValue={profile?.city ? profile?.city : ''}
										onChange={(e) => setCity(e.target.value)}
									/>
								</div>
								<div>
									<label>State</label>
									<input
										type='text'
										defaultValue={profile?.state ? profile?.state : ''}
										onChange={(e) => setState(e.target.value)}
									/>
								</div>
								<div>
									<label>Address</label>
									<input
										type='text'
										defaultValue={profile?.address ? profile?.address : ''}
										onChange={(e) => setAddress(e.target.value)}
									/>
								</div>
							</div>
						
						
						
						
						<div className='edit-profile-buttons'>
						<OpenModalButton
						buttonText="Save Changes"
						modalComponent={<EditProfileModal payload={payload} />}
						onButtonClick
						onModalClose
						/>
						<OpenModalButton
						buttonText="Delete Profile"
						modalComponent={<DeleteProfileModal />}
						onButtonClick
						onModalClose
						/>
						</div>
						
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
											disabled={new Date(event?.event_date) <= currentDate}
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
						src={profile?.profile_pic || '/sage-icon.png'}
						alt='Profile'
					/>
					<button onClick={() => setActiveSection('edit-profile')}>
						Edit Profile
					</button>
				</div>
				<div className='dashboard-title'>
					<h2>
						{profile?.first_name}&apos;s Dashboard
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
