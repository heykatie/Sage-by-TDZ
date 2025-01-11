import { useDispatch, useSelector } from 'react-redux';
import { thunkUserRSVPs } from '../../redux/rsvp';
import { useEffect } from 'react';
import './UpcomingEvents.css'
import { Link } from 'react-router-dom';
import { ConvertDate } from '../EventDetails/EventDetails';
import { ConvertTime } from '../ListEvents/ListEvents';
import StateAbbObj from '../StateAbbObj/StateAbbObj';


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
            return (<b><h2 className='text'>Virtual</h2></b>)
        }
        return (<h2 className='text'>{event?.city}, <StateAbbObj state={event?.state} /></h2>)
    }


    const EventTiles = (events) => (events?.sort((a, b) => new Date(a.event_date) - new Date(b.event_date)).map((event)=>(
        <li key = {event?.id}>
            <div className='group-card' id='event'>
                <Link to={ `/events/${event?.id}` }> 
                <div className='li-event-title'>{event?.title}</div>
                <div className='group-image-container'>
                    <img
                className='group-event-image' 
                src={event?.preview} 
                alt={event?.title} />
                </div>
                <div className='li-event-categories'>
                    {event?.categories.split(',').map((category, index) => (
                        <span 
                        className='category'
                        key={`${event?.id}-category-${index}`}
                        >
                            <p>{category.trim()}</p>
                        </span>
                    ))}</div>
                    
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
    )))

    return (
        <>
        <div className='event-list-container'>
        <h2 className='upcoming-events-title'>UPCOMING EVENTS</h2>
        {upcomingEvents && <p>You have RSVPd &apos;Yes&apos; to the following events:</p>}
        <ul className='event-list'>
            { upcomingEvents ? 
                EventTiles(upcomingEvents)
             :
            <h3>No upcoming events found, RSVP to an event to get started!</h3>
            }
        </ul>
        </div>
        </>
    )
}

export default UpcomingEvents