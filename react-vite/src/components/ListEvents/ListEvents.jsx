import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as eventActions from '../../redux/event';
import './ListEvents.css';
import { useEffect } from 'react';
import UpcomingEvents from '../UpcomingEvents/UpcomingEvents';
import { ConvertDate } from '../EventDetails/EventDetails';

export const stateAbbObj = {
	'Alabama': 'AL',
	'Alaska': 'AK',
	'Arizona': 'AZ',
	'Arkansas': 'AR',
	'California': 'CA',
	'Colorado': 'CO',
	'Connecticut': 'CT',
	'Delaware': 'DE',
	'Florida': 'FL',
	'Georgia': 'GA',
	'Hawaii': 'HI',
	'Idaho': 'ID',
	'Illinois': 'IL',
	'Indiana': 'IN',
	'Iowa': 'IA',
	'Kansas': 'KS',
	'Kentucky': 'KY',
	'Louisiana': 'LA',
	'Maine': 'ME',
	'Maryland': 'MD',
	'Massachusetts': 'MA',
	'Michigan': 'MI',
	'Minnesota': 'MN',
	'Mississippi': 'MS',
	'Missouri': 'MO',
	'Montana': 'MT',
	'Nebraska': 'NE',
	'Nevada': 'NV',
	'New Hampshire': 'NH',
	'New Jersey': 'NJ',
	'New Mexico': 'NM',
	'New York': 'NY',
	'North Carolina': 'NC',
	'North Dakota': 'ND',
	'Ohio': 'OH',
	'Oklahoma': 'OK',
	'Oregon': 'OR',
	'Pennsylvania': 'PA',
	'Rhode Island': 'RI',
	'South Carolina': 'SC',
	'South Dakota': 'SD',
	'Tennessee': 'TN',
	'Texas': 'TX',
	'Utah': 'UT',
	'Vermont': 'VT',
	'Virginia': 'VA',
	'Washington': 'WA',
	'West Virginia': 'WV',
	'Wisconsin': 'WI',
	'Wyoming': 'WY'
	} 



export const ConvertTime = (time) => {
	if(time.length === 7) return `${time.slice(0, 4)} AM`
	if(time.length === 8 && +time.slice(0, 2) < 12) return `${time.slice(0, 5)} AM`
	if(time.length === 8 && +time.slice(0, 2) > 12) return `${time.slice(0, 2)-12}:${time.slice(3, 5)} PM`
	if(time.length === 8 && +time.slice(0, 2) === 12) return `${time.slice(0, 2)}:${time.slice(3, 5)} PM`
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
            return (<b><h2 className='text'>Virtual</h2></b>)
        }
        return (<h2 className='text'>{event?.city}, {stateAbbObj[event?.state]}</h2>)
    }
	const upcoming = events.filter(event=>typeof ConvertDate(event?.event_date) === 'string');
	const past = events.filter(event=>typeof ConvertDate(event?.event_date) !== 'string');

	const sortA = (a, b) => new Date(b.event_date) - new Date(a.event_date);
	const sortB = (a, b) => new Date(a.event_date) - new Date(b.event_date);

	const eventTiles = (events, sort) =>
		events?.sort(sort).map((event) => (
			<li className='profile-events' key={event?.id}>
				<div className='group-card' id='event'>
					<Link to={`/events/${event?.id}`}>
						<div className='li-event-title'>{event?.title}</div>
						<div className='group-image-container'>
							<img 
							className='group-event-image'
							src={event.preview} 
							alt={event?.title} />
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
								<b><Location event={event} /></b>
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
		));


	return (
		<>
			<div className='event-list-container'>
				<h1>Volunteer Opportunities:</h1>
				<ul className='event-list'>
					{events.length > 0 ? (
						<>
						{eventTiles(upcoming, sortB)}
						{eventTiles(past, sortA)}
						</>
						
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
