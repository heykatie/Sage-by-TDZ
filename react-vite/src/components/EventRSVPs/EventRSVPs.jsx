import './EventRSVPs.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { thunkSingleEvent, thunkGetRSVPs } from '../../redux/events';
import { thunkAllUsers } from '../../redux/user';
import { thunkAllFriends } from '../../redux/friends';
import { IoIosMore } from "react-icons/io";

export default function EventRSVPs() {
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
    const rsvps = Object.values(useSelector(state=>state.event.rsvps));
    const users = useSelector(state=>state.user.users);
    const friends = useSelector(state=>state.friends.allFriends);

    const linkSrc = (id) => {
        if(friends[id]) return `/friends/${id}`
        if(id === currentUser.id) return `/profile/`
        return ``
    }

    console.log(currentUser.id)

    const rsvpTile = r => {
        return (
            <div className='rsvp-tile' key={r.id}>
                <Link
                className='friend-link'
                to={linkSrc(r.user_id)}
                >
                <img src={users[r.user_id].profile_pic} className='profile-pic' />
                <h3 className='friend-name'>{users[r.user_id].first_name}</h3>
                <IoIosMore className='more-dots' />
                </Link>
            </div>
        )
    }


    return (
        <div>
            {event && event.map(e=>(
                <div key={e.event.id}>
                    <h1>{e.event.title} - RSVPs</h1>
                    {rsvps && rsvps.map(r=>(
                        rsvpTile(r)
                    ))}
                </div>
            ))}
        </div>
    )
}
