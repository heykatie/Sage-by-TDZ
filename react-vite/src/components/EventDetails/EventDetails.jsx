import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MdLocalPhone } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";
import { TfiEmail } from "react-icons/tfi";
import { useEffect, useState } from 'react';
import OpenModalButton  from '../OpenModalButton/OpenModalButton'
import { useModal } from "../../context/Modal";
// import FeedbackModal from '../FeedbackRatingInput/FeebackModal'
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
import { fetchUserGroups } from '../../redux/user';


export const ConvertDate = (date) => {
   
    const currentDate = new Date();
    if(currentDate > new Date(date)) return ("PAST")
    date = new Date(date+'T00:00:00-05:00').toString()
    return `${date.slice(0, 3)}, ${date.slice(3, 10)}, ${date.slice(11, 15)}`
}


const EventDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { setModalContent } = useModal();
    const { eventId } = useParams();
    const[isLoaded, setisLoaded] = useState(false);

    useEffect(() => {
        dispatch(thunkSingleEvent(eventId));
        dispatch(thunkGetRSVPs(eventId));
        dispatch(fetchUserGroups());
        setisLoaded(true)
    }, [dispatch, eventId])



    const currentUser = useSelector((state) => state.session?.user);
    const event = useSelector((state) => state.event?.event);
    const eventInfo = event[eventId];
    const rsvps = Object.values(useSelector(state=>state.event?.rsvps))
    const rsvpArr = rsvps.map(r=>r?.user_id);
    const currentDate = new Date();
    const groups = useSelector(state=>state.user.groups);
    const targetGroup = Object.values(groups).filter(g=>g.event_title === eventInfo?.event?.title)


    const Rsvp = () => {
        if(!rsvpArr.includes(currentUser.id) && new Date(eventInfo?.event?.event_date) > currentDate) {
            return (<OpenModalButton
                buttonText="Click here to RSVP"
                modalComponent={<RSVPModal navigate={navigate} eventId={eventId} />}
                onButtonClick
                onModalClose
                /> )
        }
        if(new Date(eventInfo?.event?.event_date) > currentDate){return (
            <div className='create-group-button-container'>
                {!targetGroup.length && <p>Invite your friends to volunteer with you!</p>}
                {!targetGroup.length && <OpenModalButton
                    buttonText="Create a Group"
                    modalComponent={<CreateGroupModal onClose={() => setModalContent(null)} />}
                />}
                {targetGroup.length? <button><Link to='/groups/'>View Groups</Link></button> : <></>}
                <OpenModalButton
                buttonText="Remove RSVP"
                modalComponent={<RemoveRSVPModal navigate={navigate} eventId={eventId} rsvps={rsvps} currentUser={currentUser} eventInfo={eventInfo} />} 
                onClose={() => setModalContent(null)}
                />
            </div>
        )}
    }

    const Location = ({event}) => {
        if(event?.state === 'None') {
            return (<h3 className='city-state-toggle'><b>Virtual</b></h3>)
        }
        return (
            <>
            <h3>{event?.address}</h3>
            <h3>{event?.city},</h3>
            <h3>{event?.state}</h3>
            </>
        )
    }

    const handleClick = () => alert('Feature coming soon..')


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
                    <b><Location event={event} /></b>
                </div>
                <div className='date-time-info'>
                   <h2>Date & Time</h2>
                    <h3>Date: {<b><b>{ConvertDate(event?.event_date)}</b></b>}</h3>
                    {ConvertDate(event?.event_date) !== 'PAST' && <h3>Start: <b>{ConvertTime(event?.start_time)}</b></h3>}
                    {ConvertDate(event?.event_date) !== 'PAST' && <h3>End: <b>{ConvertTime(event?.end_time)}</b></h3>}
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
                <EventRSVPTiles targetGroup={targetGroup} />
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
                <h3 className='community-feedback'>Community Feedback: <AvgReaction rating={avgFeedback} /> </h3>
                {
                    event?.avgFeedback?
                    <p><AvgReaction rating={avgFeedback}/> {organizer?.name}</p> :
                    <p>Voice your feedback!</p>
                }

                {
                    currentUser?
                    // <OpenModalButton
                    // buttonText="Give Your Feedback"
                    // modalComponent={
                    // <FeedbackModal 
                    // eventId={event?.id} organizer={organizer} user={currentUser}/>}
                    // onButtonClick
                    // onModalClose
                    // /> 
                    <button onClick={handleClick}>Give Your Feedback</button>
                    :
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
                            <h3>Date: <b>{ConvertDate(event?.event_date)}</b></h3>
                            <h3>Start: <b>{ConvertTime(event?.start_time)}</b></h3>
                            <h3>End: <b>{ConvertTime(event?.end_time)}</b></h3>
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