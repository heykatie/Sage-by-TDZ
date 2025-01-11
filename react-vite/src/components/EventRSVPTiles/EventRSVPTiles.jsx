import './EventRSVPTiles.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { thunkSingleEvent, thunkGetRSVPs } from '../../redux/events';
import { thunkAllUsers } from '../../redux/user';
import { thunkAllFriends } from '../../redux/friends';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import RSVPModal from '../RSVPModal/RSVPModal';
import { IoArrowForward } from "react-icons/io5";


const TileTitle = ({eventId, targetGroup}) => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.session.user);
    const currentDate = new Date();

    useEffect(() => {
        dispatch(thunkSingleEvent(eventId))
        dispatch(thunkGetRSVPs(eventId))
        dispatch(thunkAllUsers())
        dispatch(thunkAllFriends())
    }, [dispatch, eventId]);

    const eventDate = new Date(useSelector(state=>state.event?.event[eventId]?.event?.event_date))
    const rsvps = Object.values(useSelector(state=>state.event.rsvps)).map(r=>r.user_id);
    const targetRsvp = rsvps.includes(currentUser.id);
    if(!targetRsvp && rsvps.length == 1 && eventDate > currentDate) {return (
        <div className='rsvps-label-link'>
           <h4>{rsvps?.length} user has RSVPd, join in the fun!</h4>
           <Link
            to={`/events/${eventId}/rsvps`}
            className='view-rsvps-link'
            >View all RSVPs <IoArrowForward /></Link>  
        </div> 
    )}
    else if (!targetRsvp && rsvps.length > 1 && eventDate > currentDate) {
        return (
        <div className='rsvps-label-link'>
            <h4>{rsvps?.length} users have RSVPd, join in the fun!</h4>
            <Link
            to={`/events/${eventId}/rsvps`}
            className='view-rsvps-link'
            >View all RSVPs <IoArrowForward /></Link>
        </div>)
    } 
    else if (targetRsvp && !targetGroup && rsvps.length > 1 && eventDate > currentDate) {
        return (
        <div className='rsvps-label-link'>
            <h4>{rsvps?.length} users have RSVPd - Invite Friends to join you!</h4>
            <Link
            to={`/events/${eventId}/rsvps`}
            className='view-rsvps-link'
            >View all RSVPs <IoArrowForward /></Link>
        </div>)
    } 
    else if (targetRsvp && !targetGroup && rsvps.length === 1 && eventDate > currentDate) {
        return (
        <div className='rsvps-label-link'>
            <h4>You have RSVPd - Invite Friends to join you!</h4>
            <Link
            to={`/events/${eventId}/rsvps`}
            className='view-rsvps-link'
            >View all RSVPs <IoArrowForward /></Link>
        </div>)
    }
    else if (targetRsvp && targetGroup && rsvps.length === 1 && eventDate > currentDate) {
        return (
            <div className='rsvps-label-link'>
                <h4>You have RSVPd</h4>
                <Link
                to={`/events/${eventId}/rsvps`}
                className='view-rsvps-link'
                >View all RSVPs <IoArrowForward /></Link>
            </div>
        )
    }
    else if (targetRsvp && targetGroup && rsvps.length > 1 && eventDate > currentDate) {
        return (
            <div className='rsvps-label-link'>
                <h4>{rsvps?.length} users have RSVPd</h4>
                <Link
                to={`/events/${eventId}/rsvps`}
                className='view-rsvps-link'
                >View all RSVPs <IoArrowForward /></Link>
            </div>
        )
    }
    else if (targetRsvp && rsvps.length && eventDate < currentDate) {
        return (
            <div className='rsvps-label-link'>
                <h4>Event past! - Thanks for joining us!</h4>
                <Link
                to={`/events/${eventId}/rsvps`}
                className='view-rsvps-link'
                >View all RSVPs <IoArrowForward /></Link>
            </div>
        )
    }
    return (
        <div className='rsvps-label-link'>
                <h4>Event past! - These users participated, thanks all!</h4>
                <Link
                to={`/events/${eventId}/rsvps`}
                className='view-rsvps-link'
                >View all RSVPs <IoArrowForward /></Link>
            </div>
    )
}

export default function EventRSVPTiles({targetGroup}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { eventId } = useParams();
    const currentUser = useSelector((state) => state.session.user);

    if(!currentUser) navigate('/');

    useEffect(() => {
        dispatch(thunkSingleEvent(eventId))
        dispatch(thunkGetRSVPs(eventId))
        dispatch(thunkAllUsers())
        dispatch(thunkAllFriends())
    }, [dispatch, eventId]);

    const event = Object.values(useSelector(state=>state.event.event));
    const rsvps = useSelector(state=>state.event.rsvps);
    const users = useSelector(state=>state.user.users);
    const friends = useSelector(state=>state.friends.allFriends);
    const rsvpArr = Object.values(rsvps);
    const targetRsvp = rsvpArr.filter(r=>r.user_id===currentUser.id)

    const linkSrc = (id) => {
        if(friends[id]) return `/friends/${id}`
        if(id === currentUser.id) return `/profile/`
        return '/'
    }



    const Rsvp = () => {
        if(!targetRsvp) {
            return (<OpenModalButton
                buttonText="Click here to RSVP"
                modalComponent={<RSVPModal eventId={event?.id} />}
                onButtonClick
                onModalClose
                /> )
        }
    }

    const RsvpTile = r => {
        return (
            <div>
               <div className='event-rsvp-tile' key={r.id}>
                    <Link
                    className='rsvp-link'
                    to={currentUser && linkSrc(r.user_id)}
                    >
                    <img src={users[r.user_id]?.profile_pic} className='profile-pic' />
                    <h3 className='friend-name'>{users[r.user_id]?.first_name}</h3>
                    </Link>
                </div> 
            </div>
            
        )
    }
    
    if(currentUser && !rsvpArr?.length) return (<p>Event past! Contact the organizer for more information on upcoming events</p>)


    return (
        <div key={event?.id}>
            {event && event.map(e=>(
                <>
                    {currentUser && <TileTitle targetGroup={targetGroup} eventId={eventId} />}
                    <div className='rsvp-tiles-container' key={e.event?.id}>
                    {rsvps && Object.values(rsvps).map(r=>(
                        <div key={r?.id}>{RsvpTile(r)}</div>
                    ))}
                    </div> 
                </>
                
            ))}
            {!currentUser && <Rsvp />}
        </div>
    ) 
    
    
}
