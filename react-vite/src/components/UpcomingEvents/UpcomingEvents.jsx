import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUpcomingEvents } from '../../redux/event';
import { useEffect } from 'react';
import './UpcomingEvents.css'


const UpcomingEvents = ({user}) => {

    const dispatch = useDispatch()

    // const user = useSelector((state) => state.session.user)

    useEffect(() => {
        dispatch(getAllUpcomingEvents())
    }, [dispatch, user.id])

    const upcomingEvents = Object.values(useSelector((state) => state.events.upcoming))

    const eventTiles = (events) => (events.map((event)=>(
        <li key = {event.id}>
            <div className='li-event-list'>
                <Link to={ `/events/${event.id}` } > {event.title}
                <img src={event.preview} alt={event.title} />
                <div className='li-event-categories'></div>
                    {event.categories.split(',').forEach(category => {
                        <li className='category'>
                            <p>{category}</p>
                        </li>
                    })}
                <div className='li-event-description'>
                    <h2>{event.city}, {event.state}</h2>
                    <h3>Date: {event.event_date}</h3>
                    <h3>Start Time: {event.start_time}</h3>
                    <h3>End Time: {event.end_time}</h3>
                    {/* <p>{event.description}</p> */}
                </div>
                </Link>
            </div>
        </li>
    )))

    return (
        <>
        <div className='event-list-container'>
        <h1>UPCOMING EVENTS</h1>
        <ul className='event-list'>
            { upcomingEvents ?
            eventTiles(upcomingEvents) :
            <h1>RSVP to see Upcoming Events</h1>
            }
        </ul>
        </div>
        </>
    )
}

export default UpcomingEvents