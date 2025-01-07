import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as eventActions from '../../redux/event';
import './ListEvents.css';
import { useEffect } from 'react';
import UpcomingEvents from '../UpcomingEvents/UpcomingEvents';
import { ConvertDate } from '../EventDetails/EventDetails';

export const ConvertTime = (time) => {
	if(time.length === 7) return `${time.slice(0, 4)} AM`
	if(time.length === 8 && +time.slice(0, 2) < 12) return `${time.slice(0, 5)} AM`
	if(time.length === 8 && +time.slice(0, 2) > 12) return `${time.slice(0, 2)-12}:${time.slice(3, 5)} PM`
}

const ListEvents = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(eventActions.getAllEvents());
	}, [dispatch]);

	const user = useSelector((state) => state.session.user);
	const events = Object.values(useSelector((state) => state.events.events));

    const Location = ({event}) => {
        if(event?.state === 'None') {
            return (<h2 className='text'>Virtual</h2>)
        }
        return (<h2 className='text'>{event?.city}, {event?.state}</h2>)
    }

	const eventTiles = (events) =>
		events.map((event) => (
			<li className='profile-events' key={event.id}>
				{console.log(event.start_time, event.start_time.length)}
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
			{user ? <UpcomingEvents user={user} events={events} /> : ''}
		</>
	);
};

export default ListEvents;
