import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdLocalPhone } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";
import { TfiEmail } from "react-icons/tfi";
import { useEffect, useState } from 'react';
import OpenModalButton  from '../OpenModalButton/OpenModalButton'
import { useModal } from "../../context/Modal";
import FeedbackModal from '../FeedbackRatingInput/FeebackModal'
import './EventDetails.css';
import { thunkSingleEvent } from '../../redux/events';
import AvgReaction from '../AvgReaction/AvgReaction';
import EventRSVPTiles from '../EventRSVPTiles';
import { thunkGetRSVPs } from '../../redux/events';
import RSVPModal from '../RSVPModal/RSVPModal';
import CreateGroupModal from '../GroupComponents/GroupModals/CreateGroupModal';
import LoginFormModal from '../LoginFormModal';
import RemoveRSVPModal from '../RemoveRSVPModal/RemoveRSVPModal';
import { ConvertTime } from '../ListEvents/ListEvents';

export const ConvertDate = date => {
    return new Date(date).toLocaleDateString();
}


const EventDetails = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { setModalContent } = useModal();
    const { eventId } = useParams()
    const[isLoaded, setisLoaded] = useState(false)

    useEffect(() => {
        dispatch(thunkSingleEvent(eventId));
        dispatch(thunkGetRSVPs(eventId));
        setisLoaded(true)
    }, [dispatch, eventId])


    const currentUser = useSelector((state) => state.session.user);
    const event = useSelector((state) => state.event.event);
    const eventInfo = event[eventId];
    const rsvps = Object.values(useSelector(state=>state.event.rsvps))
    const rsvpArr = rsvps.map(r=>r?.user_id);


    const Rsvp = () => {
        if(!rsvpArr.includes(currentUser.id)) {
            return (<OpenModalButton
                buttonText="Click here to RSVP"
                modalComponent={<RSVPModal navigate={navigate} eventId={eventId} />}
                onButtonClick
                onModalClose
                /> )
        }
        return (
            <div className='create-group-button-container'>
                <p>Invite your friends to volunteer with you!</p>
                <OpenModalButton
                    buttonText="Create a Group"
                    modalComponent={<CreateGroupModal onClose={() => setModalContent(null)} />}
                    onModalClose={() => setModalContent(null)}
                />
                <OpenModalButton
                buttonText="Remove RSVP"
                modalComponent={<RemoveRSVPModal navigate={navigate} eventId={eventId} rsvps={rsvps} currentUser={currentUser} eventInfo={eventInfo} />} 
                onClose={() => setModalContent(null)}
                />
            </div>
        )
    }

    const Location = ({event}) => {
        if(event?.state === 'None') {
            return (<h3 className='city-state-toggle'>Virtual</h3>)
        }
        return (
            <>
            <h3>{event?.address}</h3>
            <h3>{event?.city}</h3>
            <h3>{event?.state}</h3>
            </>
        )
    }


    if (eventInfo && isLoaded && currentUser) {

        const event = eventInfo?.event;
        const categories = event?.categories.split(',');
        const organizer = eventInfo?.organizer;
        const avgFeedback = eventInfo?.avgFeedback;

    return (
        <div className='event-details-container'>
        <div className='event-details'>
            <h1 className='event-title'>{event?.title}</h1>
            <p className='description'>{event?.description}</p>
            <div className='li-event-description'>
                <div className='location-info'>
                   <h2>Location</h2>
                    <Location event={event} />
                </div>
                <div className='date-time-info'>
                   <h2>Date & Time</h2>
                    <h3>Date: {event?.event_date}</h3>
                    <h3>Start: {ConvertTime(event?.start_time)}</h3>
                    <h3>End: {ConvertTime(event?.end_time)}</h3>
                </div>
            </div>
            <div className='li-event-preview'>
                <img className='preview-img' src={event?.preview} alt={event?.title} />
            </div>
            <div className='li-event-categories'>
                {categories?.forEach(category => {
                    <li className='category'>
                        <p>{category}</p>
                    </li>
                })}
            </div>

            <div className='li-event-attendees'>
                <EventRSVPTiles />
            </div>
            <div className='li-event-rsvp'>
                {/* need rsvps reducer */}
                { currentUser?
                <Rsvp /> :
                <OpenModalButton
                buttonText="Login to RSVP"
                modalComponent={<LoginFormModal eventId={event?.id} organizer={organizer} user={currentUser}/>}
                onButtonClick
                onModalClose
                />
                }
            </div>
            <div className='li-event-invite'>
                {/* need invites reducer */}
                { currentUser?
                (
                <></>
                ) :
                <OpenModalButton
                buttonText="Login to RSVP"
                modalComponent={<LoginFormModal eventId={event?.id} organizer={organizer} user={currentUser}/>}
                onButtonClick
                onModalClose
                />
                }
            </div>
        </div>
        <div className='li-organizer-details'>
            <div className='organizer-name-logo'>
                <h2>Event Organizer - {organizer?.name}</h2>
                <img className='organizer-logo' src={organizer?.logo} alt={organizer?.name} />
            </div>

            <div className='li-organizer-description'>
                <p className='description' >{organizer?.description}</p>

                <div className='li-organizer-contact'>
                    <div className='contact-logo-label'>
                        <MdLocalPhone className='icon' />
                        <h3>Contact Us!</h3>
                        <p>{organizer?.phone_number}</p>
                    </div>


                <Link
                className='org-link'
                to={organizer.link}
                ><GoLinkExternal className='icon' />
                <p>{organizer?.link}</p>
                </Link>

                <div className='org-email'>
                    <TfiEmail className='icon' />
                    <p>{organizer?.email}</p>
                </div>

                </div>
            </div>
            <div className='li-organizer-feedback'>
                <h3>Community Feedback: <AvgReaction rating={avgFeedback} /> </h3>
                {
                    event?.avgFeedback?
                    <p><AvgReaction rating={avgFeedback}/> {organizer?.name}</p> :
                    <p>Be the first to voice your feedback !</p>
                }

                {
                    currentUser?
                    <OpenModalButton
                    buttonText="Give Your Feedback"
                    modalComponent={<FeedbackModal eventId={event?.id} organizer={organizer} user={currentUser}/>}
                    onButtonClick
                    onModalClose
                    /> :
                    <Link to={'/login'}>Log In</Link>
                }
            </div>
        </div>
        </div>

    )
    } else if (eventInfo && isLoaded) {

        const event = eventInfo?.event;
        const categories = event?.categories.split(',');
        const organizer = eventInfo?.organizer;
        const avgFeedback = eventInfo?.avgFeedback;

        return(
            <div className='event-details-container'>
                <div className='event-details'>
                    <h1 className='event-title'>{event?.title}</h1>
                    <p className='description'>{event?.description}</p>
                    <div className='li-event-description'>
                        <div className='location-info'>
                        <h2>Location</h2>
                            <h3>{event?.address}</h3>
                            <h3>{event?.city}</h3>
                            <h3>{event?.state}</h3>
                        </div>
                        <div className='date-time-info'>
                        <h2>Date and Time</h2>
                            <h3>Date: {ConvertDate(event?.event_date)}</h3>
                            <h3>Start: {ConvertTime(event?.start_time)}</h3>
                            <h3>End: {ConvertTime(event?.end_time)}</h3>
                        </div>
                    </div>
                    <div className='li-event-preview'>
                        <img className='preview-img' src={event?.preview} alt={event?.title} />
                    </div>
                    <div className='li-event-categories'>
                        {categories?.forEach(category => {
                            <li className='category'>
                                <p>{category}</p>
                            </li>
                        })}
                    </div>
                    <div className='login-to-rsvp'>
                        <OpenModalButton
                        buttonText="Login to RSVP"
                        modalComponent={<LoginFormModal eventId={event?.id} organizer={organizer} user={currentUser}/>}
                        onButtonClick
                        onModalClose
                        />
                    </div>
                    <div className='li-organizer-details'>
                        <div className='organizer-name-logo'>
                            <h2>Event Organizer - {organizer?.name}</h2>
                            <img className='organizer-logo' src={organizer?.logo} alt={organizer?.name} />
                        </div>
                        <div className='li-organizer-description'>
                            <p className='description' >{organizer?.description}</p>
                            <div className='li-organizer-contact'>
                                <div className='contact-logo-label'>
                                    <MdLocalPhone className='icon' />
                                    <h3>Contact Us!</h3>
                                    <p>{organizer?.phone_number}</p>
                                </div>
                                <Link
                                className='org-link'
                                to={organizer.link}
                                ><GoLinkExternal className='icon' />
                                <p>{organizer?.link}</p>
                                </Link>
                                <div className='org-email'>
                                    <TfiEmail className='icon' />
                                    <p>{organizer?.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className='li-organizer-feedback'>
                            <h3>Community Feedback: <AvgReaction rating={avgFeedback} /> </h3>
                        </div>
                    </div>
                </div>
            </div>
        )

    }

    return (
        <h1>No Event Found</h1>
    )

}

export default EventDetails