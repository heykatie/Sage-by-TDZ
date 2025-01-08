import { useDispatch, useSelector } from 'react-redux';
import { thunkUserRSVPs } from '../../redux/rsvp';
import { useEffect } from 'react';
import './UpcomingEvents.css'
import { Link } from 'react-router-dom';
import { ConvertDate } from '../EventDetails/EventDetails';
import { ConvertTime } from '../ListEvents/ListEvents';
import { stateAbbObj } from '../ListEvents/ListEvents';


const UpcomingEvents = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkUserRSVPs())
    }, [dispatch])

    const rsvps = useSelector((state) => state.rsvp.userRsvps.rsvps);
    const currentDate = new Date();
    
    let upcomingEvents;

    if(rsvps) {upcomingEvents = Object.values(rsvps).filter(e=>new Date(e.event_date)>currentDate)}

    const Location = ({event}) => {
        if(event?.state === 'None') {
            return (<h2 className='text'>Virtual</h2>)
        }
        return (<h2 className='text'>{event?.city}, {stateAbbObj[event?.state]}</h2>)
    }


    const eventTiles = (events) => (events?.map((event)=>(
        <li key = {event?.id}>
            <div className='li-event-list'>
                <Link to={ `/events/${event?.id}` }> 
                <div className='li-event-title'>{event?.title}</div>
                <img src={event?.preview} alt={event?.title} />
                <div className='li-event-categories'></div>
                    {event?.categories.split(',').forEach(category => {
                        <li className='category'>
                            <p>{category}</p>
                        </li>
                    })}
                <div className='li-event-location-time'>
                    <div className='city-date'>
                       <Location event={event} />
                        <h3>Date: {ConvertDate(event?.event_date)}</h3> 
                    </div>
                    <div className='start-end-time'>
                       <h3>Start: {ConvertTime(event?.start_time)}</h3>
                        <h3>End: {ConvertTime(event?.end_time)}</h3> 
                    </div>
                </div>
                <p className='upcoming-event-description'>{event.description}</p>
                </Link>
            </div>
        </li>
    )))

    return (
        <>
        <div className='event-list-container'>
        <h2 className='upcoming-events-title'>UPCOMING EVENTS</h2>
        <p>You have RSVPd &apos;Yes&apos; to the following events:</p>
        <ul className='event-list'>
            { rsvps && rsvps?.length ?
            eventTiles(upcomingEvents) :
            <h3>No upcoming events found, RSVP to an event to get started!</h3>
            }
        </ul>
        </div>
        </>
    )
}

export default UpcomingEvents