import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdLocalPhone } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";
import { TfiEmail } from "react-icons/tfi";
import { useEffect, useState } from 'react';
import OpenModalButton  from '../OpenModalButton/OpenModalButton'
import FeedbackModal from '../FeedbackModal/FeedbackModal'
import './EventDetails.css';
import AllAttendees from '../AllAttendees/AllAttendees';
import { thunkSingleEvent } from '../../redux/events';
import AvgReaction from '../AvgReaction/AvgReaction';

const EventDetails = () => {

    const dispatch = useDispatch()

    const { eventId } = useParams()

    const[isLoaded, setisLoaded] = useState(false)

    useEffect(() => {
        dispatch(thunkSingleEvent(eventId))
        setisLoaded(true)
    }, [dispatch, eventId])



    const user = useSelector((state) => state.session.user);
    const event = useSelector((state) => state.event.event);
    const eventInfo = event[eventId];

    if (eventInfo && isLoaded) {
        console.log('ALL EVENTS --->', eventInfo)
        const event = eventInfo?.event

        const categories = event?.categories.split(',');

        const organizer = eventInfo?.organizer

        const avgFeedback = eventInfo?.avgFeedback;

    return (
        <>
        <div className='event-details-container'>
            <h1>{event?.title}</h1>
            <div className='li-event-description'>
                <p>{event?.description}</p>
                <h2>Location</h2>
                <h3>{event?.address}</h3>
                <h3>{event?.city}</h3>
                <h3>{event?.state}</h3>
                <h2>Date and Time</h2>
                <h3>Date: {event?.event_date}</h3>
                <h3>Start Time: {event?.start_time}</h3>
                <h3>End Time: {event?.end_time}</h3>
            </div>
            <div className='li-event-preview'>
                <img src={event?.preview} alt={event?.title} />
            </div>
            <div className='li-event-categories'>
                {categories?.forEach(category => {
                    <li className='category'>
                        <p>{category}</p>
                    </li>
                })}
            </div>
        
            <div className='li-event-attendees'>
                <AllAttendees />
                {/* need rsvps reducer */}
            </div>
            <div className='li-event-rsvp'>
                {/* need rsvps reducer */}
            </div>
            <div className='li-event-invite'>
                {/* need invites reducer */}
            </div>
        </div>
        <div className='li-organizer-details'>
            <h2>{organizer?.name}</h2>
            <div className='li-organizer-description'>
                <p>{organizer?.description}</p>
                <div className='li-organizer-logo'>
                    <img src={organizer?.logo} alt={organizer?.name} />
                </div>
                <div className='li-organizer-contact'>
                <h3>Contact Us!</h3>
                <MdLocalPhone className='icon' />
                    <p>{organizer?.phone_number}</p>
                <Link to={organizer.link}><GoLinkExternal className='icon' /> <p>{organizer?.link}</p></Link>
                <TfiEmail className='icon' />
                    <p>{organizer?.email}</p>
                </div>
            </div>
            <div className='li-organizer-feedback'>
                <h3>Community Feedback: </h3>
                { 
                    event?.avgFeedback?
                    <p><AvgReaction rating={avgFeedback}/> {organizer?.name}</p> :
                    <p>Be the first to voice your feedback !</p>
                }
                
                {
                    user?
                    <OpenModalButton
                    buttonText="Give Your Feedback"
                    modalComponent={<FeedbackModal eventId={event?.id} organizer={organizer} user={user}/>}
                    onButtonClick
                    onModalClose
                    /> :
                    <Link to={'/login'}>Log In</Link>
                }
            </div>
        </div>
        </>

    )
    }

    return (
        <h1>No Event Found</h1>
    )

}

export default EventDetails