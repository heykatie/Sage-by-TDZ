import './EventRSVPs.css';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { thunkSingleEvent, thunkGetRSVPs } from '../../redux/events';
import { thunkAllUsers } from '../../redux/user';
import { IoIosMore } from "react-icons/io";
import { Link } from 'react-router-dom';
import { thunkAllFriends } from '../../redux/friends';
import { IoArrowBack } from "react-icons/io5";

export default function EventRSVPs() {
    const dispatch = useDispatch();

    const { eventId } = useParams();

    useEffect(() => {
        dispatch(thunkSingleEvent(eventId));
        dispatch(thunkGetRSVPs(eventId));
        dispatch(thunkAllUsers());
        dispatch(thunkAllFriends());
    }, [dispatch, eventId]);


    const event = Object.values(useSelector(state=>state.event.event));
    const rsvps = Object.values(useSelector(state=>state.event.rsvps));
    const users = useSelector(state=>state.user.users);
    const friends = useSelector(state=>state.friends.allFriends);
    const currentUser = useSelector((state) => state.session.user);

    const linkSrc = (id) => {
        if(friends[id]) return `/friends/${id}`
        if(id === currentUser.id) return `/profile/`
        // need page for users who are not friends
        return ``
    }

    const rsvpTile = r => {
        return (
            <div className='friend-tile'>
               <Link 
               className='friend-link'
               key={r.id}
               to={linkSrc(r.id)}
               >
                    <img className='profile-pic' src={users[r.user_id]?.profile_pic} />
                    <h3 className='friend-name'>{users[r.user_id]?.first_name}</h3>
                    <IoIosMore className='more-dots' />
                </Link> 
            </div>
            
        )
    }


    return (
        <div>
            {event && event.map(e=>(
                <div key={e.event?.id}>
                    <h1>{e.event?.title} - RSVPs</h1>
                    <Link 
                    to={`/events/${eventId}`}
                    className='event-page-back-link'
                    ><IoArrowBack /> Back to Event Page</Link>
                    {rsvps && rsvps.map(r=>(
                        rsvpTile(r)
                    ))}
                </div>
            ))}
        </div>
    )
}
