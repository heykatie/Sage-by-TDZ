import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import sprout from '../../../../dist/assets/sprout.png';

const GroupPage = () => {
	const navigate = useNavigate();
	const { groupId } = useParams();
	const { group } = useSelector((state) => state.group);
	const currentUser = useSelector((state) => state.session.user);

	if (!group) {
		return <p>Loading group details...</p>;
	}

	return (
		<div className='group-page'>
			<div className='event-header'>
				<img
					className='event-banner'
					src={group.event?.preview || sprout} // Use the event preview or default image
					alt='Event Banner'
				/>
			</div>
			<h2>{`Group for ${group.event?.title || 'Event Title'}`}</h2>
			<p>
				Hosted by: {`${currentUser?.first_name} ${currentUser?.last_name}`}
			</p>
			<p>{`${group.event?.event_date} | ${group.event?.start_time} | ${group.event?.categories}`}</p>
			<p>{group.event?.address}</p>
			<a href={`/events/${group.event?.id}`} className='event-link'>
				View Event Details
			</a>

			{/* Group description */}
			<div className='group-description'>
				<h3>Group Description</h3>
				<p>{group.description || 'No description added yet.'}</p>
			</div>

			{/* Invited Friends */}
			<section className='friends-section'>
				<h3>Friends in this Group</h3>
				<div className='friends-list'>
					{group.invitedFriends.length ? (
						group.invitedFriends.map((friend) => (
							<div className='friend-item' key={friend.id}>
								<img
									src={friend.profile_pic || sprout}
									alt={`${friend.first_name}'s profile`}
									className='friend-profile-pic'
								/>
								<span>{`${friend.first_name} ${friend.last_name}`}</span>
							</div>
						))
					) : (
						<p>No friends added to this group yet.</p>
					)}
				</div>
			</section>

			{/* Navigation Buttons */}
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
			</div>
		</div>
	);
};

export default GroupPage;
