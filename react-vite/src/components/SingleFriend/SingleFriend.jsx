import './SingleFriend.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkSingleFriend } from '../../redux/friends';
import { thunkSharedEvents } from '../../redux/friends';
import { FaUserCheck } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import { ConvertDate } from '../EventDetails/EventDetails';
import { ConvertTime } from '../ListEvents/ListEvents';



export default function SingleFriend() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { friendId } = useParams();

    const currentUser = useSelector((state) => state.session.user);
    const friend = Object.values(useSelector(state=>state.friends.friend));
    const sharedEvents = Object.values(useSelector(state=>state.friends.sharedEvents));

    useEffect(() => {
        dispatch(thunkSingleFriend(friendId));
        dispatch(thunkSharedEvents(friendId));
        if(!currentUser) navigate('/');
    }, [dispatch, friendId, currentUser, navigate]);

    const handleClick = () => { alert("Feature Coming Soon..."); };


    const friendInfo = friend => {
        return (
            <div className='dashboard-title' key={friend?.id}>
                <img className='profile-picture' height='100px' width='100px' src={friend?.profile_pic} />
                <div className='friend-info'>
                    <h2 className='friend-name'>{friend?.first_name} {friend?.last_name}</h2>
                    <h4>{friend?.username} | {friend?.city} | {friend?.state}</h4>
                </div>
                <button
                onClick={handleClick} 
                className='friends-button'
                ><FaUserCheck /> Friends</button>
            </div>
        )
    }

    const Location = ({event}) => {
        if(event?.state === 'None') {
            return (<h2 className='city-state-toggle'>Virtual</h2>)
        }
        return (<h2 className='city-state-toggle'>{event?.city}, {event?.state}</h2>)
    }
    
    const eventInfo = events => {
        if(!events.length) {
           return (
            <h1>No Shared Events Found</h1>
            ) 
        } else {
            return (events.map(event=>(
                <Link 
                className='shared-event-info' 
                key={event.id}
                to={`/events/${event.id}`}
                >
                    <h2 className='title'>{event.title}</h2>
                    <img className='event-img' height='400px' width='400px' src={event.preview} />
                    <div className='date-time' id='shared'>
                        <Location event={event} className="shared" />
                        <p>{ConvertDate(event.event_date)}</p> 
                        <p>{ConvertTime(event.start_time)}</p>
                    </div>
                </Link>
            ))) 
        } 
    }



    if(friend.length) {
        return (
        <div className='single-friend'>
            {friend && friend.map(f=>(friendInfo(f)))}
            <div className='info-body'>
                <h3>Shared Events</h3>
                <p>You and {friend[0]?.first_name} both attended:</p>
                {sharedEvents && eventInfo(sharedEvents)}
            </div>
        </div>
        )
    } else return (<h1>No Friend Found</h1>)
    
}