import './EventRSVPTiles.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { thunkSingleEvent, thunkGetRSVPs } from '../../redux/events';
import { thunkAllUsers } from '../../redux/user';
import { thunkAllFriends } from '../../redux/friends';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import RSVPModal from '../RSVPModal/RSVPModal';

const TileTitle = ({eventId}) => {
    const dispatch = useDispatch();

    const currentUser = useSelector((state) => state.session.user);

    useEffect(() => {
        dispatch(thunkSingleEvent(eventId))
        dispatch(thunkGetRSVPs(eventId))
        dispatch(thunkAllUsers())
        dispatch(thunkAllFriends())
    }, [dispatch, eventId]);

    const rsvps = Object.values(useSelector(state=>state.event.rsvps)).map(r=>r.user_id);

    if(!rsvps.includes(currentUser.id)) {return (
        <div className='rsvps-label-link'>
           <h4>{rsvps?.length} Users have RSVPd, join in the fun!</h4>
           <Link
            to={`/events/${eventId}/rsvps`}
            className='view-rsvps-link'
            >View all RSVPs</Link>  
        </div> 
    )} else if (rsvps[currentUser.id]) {
        return (
        <div className='rsvps-label-link'>
            <h4>{Object.values(rsvps)?.length} Users have RSVPd</h4>
            <Link
            to={`/events/${eventId}/rsvps`}
            className='view-rsvps-link'
            >View all RSVPs</Link>
        </div>)
    } else {
        return (
        <div>
        </div>
        )
    }
}

export default function EventRSVPTiles() {
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

    const linkSrc = (id) => {
        if(friends[id]) return `/friends/${id}`
        if(id === currentUser.id) return `/profile/`
        // need page for users who are not friends
        return ``
    }


    const Rsvp = () => {
        if(!rsvpArr.includes(currentUser.id)) {
            return (<OpenModalButton
                buttonText="Click here to RSVP"
                modalComponent={<RSVPModal eventId={event?.id} />}
                onButtonClick
                onModalClose
                /> )
        }
        return (<button>Log In to RSVP</button>)
    }

    const rsvpTile = r => {
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
                    {currentUser && <TileTitle eventId={eventId} />}
                <div className='rsvp-tiles-container' key={e.event?.id}>
                    {rsvps && Object.values(rsvps).map(r=>(
                        <div key={r?.id}>{rsvpTile(r)}</div>
                    ))}
                    </div> 
                </div>
                
            ))}
            {!currentUser && <Rsvp />}
        </div>
    ) 
    
    
}
