import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as eventActions from '../../redux/event';
import './ListEvents.css';
import { useEffect } from 'react';
import UpcomingEvents from '../UpcomingEvents/UpcomingEvents';

const ListEvents = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(eventActions.getAllEvents());
	}, [dispatch]);

	const user = useSelector((state) => state.session.user);
	const events = Object.values(useSelector((state) => state.events.events));

	const eventTiles = (events) =>
		events.map((event) => (
			<li key={event.id}>
				<div className='li-event-list'>
					<Link to={`/events/${event?.id}`}>
						<div className='li-event-title'>{event?.title}</div>
						<div className='li-event-image'>
							<img src={event.preview} alt={event?.title} />
						</div>
						<div className='li-event-categories'>
							{event.categories.split(',').map((category, index) => (
								<span
									className='category'
									key={`${event.id}-category-${index}`}>
									<p>{category.trim()}</p>
								</span>
							))}
						</div>
						<div className='li-event-description'>
							<div className='city-date'>
								<h2>
									{event?.city}, {event?.state}
								</h2>
								<h3>Date: {event?.event_date}</h3>
							</div>
							<div className='start-end-time'>
								<h3>Start Time: {event?.start_time}</h3>
								<h3>End Time: {event?.end_time}</h3>
							</div>
						</div>
						<p>{event?.description}</p>
					</Link>
				</div>
			</li>
		));

	return (
		<>
			<div className='event-list-container'>
				<h1>Current Volunteer Opportunities:</h1>
				<ul className='event-list'>
					{events.length > 0 ? (
						eventTiles(events)
					) : (
						<h1>No Events Found</h1>
					)}
				</ul>
			</div>
			{user ? <UpcomingEvents user={user} /> : ''}
		</>
	);
};

export default ListEvents;
