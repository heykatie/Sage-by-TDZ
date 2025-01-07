import { useDispatch, useSelector } from 'react-redux';
import { thunkUserRSVPs } from '../../redux/rsvp';
import { useEffect } from 'react';
import './UpcomingEvents.css'
import { Link } from 'react-router-dom';


const UpcomingEvents = ({user, events}) => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkUserRSVPs())
    }, [dispatch])

    const rsvps = useSelector((state) => state.rsvp.userRsvps.rsvps);
    let upcomingEvents;

    if(rsvps) {upcomingEvents = Object.values(rsvps)}

    


    const eventTiles = (events) => (events?.map((event)=>(
        <li key = {event?.id}>
            <div className='li-event-list'>
                <Link to={ `/events/${event?.id}` } > {event?.title}
                <img src={event?.preview} alt={event?.title} />
                <div className='li-event-categories'></div>
                    {event?.categories.split(',').forEach(category => {
                        <li className='category'>
                            <p>{category}</p>
                        </li>
                    })}
                <div className='li-event-description'>
                    <div className='city-date'>
                       <h2>{event?.city}, {event?.state}</h2>
                        <h3>Date: {event?.event_date}</h3> 
                    </div>
                    <div className='start-end-time'>
                       <h3>Start Time: {event?.start_time}</h3>
                        <h3>End Time: {event?.end_time}</h3> 
                    </div>
                </div>
                <p className='event-description'>{event.description}</p>
                </Link>
            </div>
        </li>
    )))

    return (
        <>
        <div className='event-list-container'>
        <h2>UPCOMING EVENTS</h2>
        <ul className='event-list'>
            { rsvps && rsvps?.length ?
            eventTiles(upcomingEvents) :
            <h1>RSVP to see Upcoming Events</h1>
            }
        </ul>
        </div>
        </>
    )
}

export default UpcomingEvents