import './EventRSVPTiles.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { thunkSingleEvent, thunkGetRSVPs } from '../../redux/events';
import { thunkAllUsers } from '../../redux/user';
import { thunkAllFriends } from '../../redux/friends';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import RSVPModal from '../RSVPModal/RSVPModal';


const TileTitle = ({eventId, targetGroup}) => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(thunkSingleEvent(eventId))
        dispatch(thunkGetRSVPs(eventId))
        dispatch(thunkAllUsers())
        dispatch(thunkAllFriends())
    }, [dispatch, eventId]);

    const rsvps = Object.values(useSelector(state=>state.event.rsvps)).map(r=>r.user_id);
    const targetRsvp = rsvps.includes(currentUser.id);

    if(!targetRsvp && rsvps.length == 1) {return (
        <div className='rsvps-label-link'>
           <h4>{rsvps?.length} user has RSVPd, join in the fun!</h4>
           <Link
            to={`/events/${eventId}/rsvps`}
            className='view-rsvps-link'
            >View all RSVPs</Link>  
        </div> 
    )}
    else if (!targetRsvp && rsvps.length > 1) {
        return (
        <div className='rsvps-label-link'>
            <h4>{rsvps?.length} users have RSVPd, join in the fun!</h4>
            <Link
            to={`/events/${eventId}/rsvps`}
            className='view-rsvps-link'
            >View all RSVPs</Link>
        </div>)
    } 
    else if (targetRsvp && !targetGroup && rsvps.length > 1) {
        return (
        <div className='rsvps-label-link'>
            <h4>{rsvps?.length} users have RSVPd - Invite Friends to join you!</h4>
            <Link
            to={`/events/${eventId}/rsvps`}
            className='view-rsvps-link'
            >View all RSVPs</Link>
        </div>)
    } 
    else if (targetRsvp && !targetGroup && rsvps.length === 1) {
        return (
        <div className='rsvps-label-link'>
            <h4>You have RSVPd - Invite Friends to join you!</h4>
            <Link
            to={`/events/${eventId}/rsvps`}
            className='view-rsvps-link'
            >View all RSVPs</Link>
        </div>)
    }
    else if (targetRsvp && targetGroup && rsvps.length === 1) {
        return (
            <div className='rsvps-label-link'>
                <h4>You have RSVPd</h4>
                <Link
                to={`/events/${eventId}/rsvps`}
                className='view-rsvps-link'
                >View all RSVPs</Link>
            </div>
        )
    }
    else if (targetRsvp && targetGroup && rsvps.length > 1) {
        return (
            <div className='rsvps-label-link'>
                <h4>{rsvps?.length} users have RSVPd</h4>
                <Link
                to={`/events/${eventId}/rsvps`}
                className='view-rsvps-link'
                >View all RSVPs</Link>
            </div>
        )
    }
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
        // need page for users who are not friends
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


    if(!rsvpArr?.length) return (<></>)


    return (
        <div>
            {event && event.map(e=>(
                <div key={e.id}>
                    {currentUser && <TileTitle targetGroup={targetGroup} eventId={eventId} />}
                    <div className='rsvp-tiles-container' key={e.event?.id}>
                    {rsvps && Object.values(rsvps).map(r=>(
                        <div key={r?.id}>{RsvpTile(r)}</div>
                    ))}
                    </div> 
                </div>
                
            ))}
            {!currentUser && <Rsvp />}
        </div>
    ) 
    
    
}
