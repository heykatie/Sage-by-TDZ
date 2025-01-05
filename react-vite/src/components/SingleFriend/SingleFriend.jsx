import './SingleFriend.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkSingleFriend } from '../../redux/friends';
import { thunkSharedEvents } from '../../redux/friends';
import { FaUserCheck } from "react-icons/fa6";
import { Link } from 'react-router-dom';


const friendInfo = friend => {
    return (
        <div className='dashboard-title' key={friend.id}>
            <img className='profile-picture' height='100px' width='100px' src={friend.profile_pic} />
            <div className='friend-info'>
                <h2 className='friend-name'>{friend.first_name} {friend.last_name}</h2>
                <h4>{friend.username} | {friend.city} | {friend.state}</h4>
            </div>
            <button className='friends-button'><FaUserCheck /> Friends</button>
        </div>
    )
}

const eventInfo = event => {
    return (
        <div className='shared-event-info' key={event.id}>
            <h2 className='title'>{event.title}</h2>
            <img className='event-img' height='400px' width='400px' src={event.preview} />
            <div className='date-time'>
                <p>{event.city}, {event.state}</p>
                <p>{new Date(event.event_date).toUTCString().slice(0, 16)}, {event.start_time.slice(0, 5)}</p>
            </div>
        </div>
    )
}

export default function SingleFriend() {
    const { friendId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(thunkSingleFriend(friendId))
    }, [dispatch, friendId]);


    useEffect(() => {
        dispatch(thunkSharedEvents(friendId))
    }, [dispatch, friendId]);

    const handleClick = () => { alert("Feature Coming Soon..."); };

    const friend = Object.values(useSelector(state=>state.friends.friend));
    const events = Object.values(useSelector(state=>state.friends.sharedEvents));

    if(!friend.length) navigate('/');

    return (
    <div className='single-friend'>
        {friend && friend.map(f=>(friendInfo(f)))}
        <div className='info-body'>
            <h3 className='nav-title'> <Link className='events-attended' onClick={handleClick} >Events Attended </Link> | <Link className='shared-events' to={`/friends/${friendId}`}>Shared Events</Link></h3>
            {events && events.map(event=>(eventInfo(event)))}
        </div>
    </div>
    )
}