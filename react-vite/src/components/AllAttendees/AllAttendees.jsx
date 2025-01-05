import { thunkGetRSVPs, thunkSingleEvent } from '../../redux/events';
import { thunkAllUsers } from '../../redux/user';
import { thunkAllFriends } from '../../redux/friends';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './AllAttendees.css';

export default function AllAttendees({eventId}) {
    const dispatch = useDispatch();
    

    useEffect(() => {
        dispatch(thunkGetRSVPs(eventId));
        dispatch(thunkSingleEvent(eventId))
        dispatch(thunkAllUsers())
        dispatch(thunkAllFriends())
    }, [dispatch, eventId])

    const currentUser = useSelector((state) => state.session.user);
    const rsvps = Object.values(useSelector(state => state.event.rsvps));
    const users = useSelector(state=>state.user.users);
    const friends = useSelector(state=>state.friends.allFriends);
    console.log(users)

    

    const linkSrc = (id) => {
        if(friends[id]) return `/friends/${id}`
        if(id === currentUser.id) return `/profile/`
        return ``
    }

    const rsvpTile = r => {

        return (
        <div className='event-rsvp-tile' key={r.id}>
            <Link
            className='rsvp-link'
            to={linkSrc(r.user_id)}
            >
            {/* <img src={users && users[r.user_id].profile_pic} className='profile-pic' /> */}
            {/* <h3 className='friend-name'>{users[r.user_id].first_name}</h3> */}
            </Link>
        </div>
        )
    }

    

    return (
        <>
        {rsvps && rsvps.map(r=>(
            <div className='event-rsvp-tile' key={r.id}>
                <Link
                className='rsvp-link'
                to={linkSrc(r.user_id)}
                >
                {/* <img src={users[r.user_id].profile_pic} className='profile-pic' /> */}
                {/* <h3 className='friend-name'>{users[r.user_id].first_name}</h3> */}
                </Link>
            </div>
        ))}
        </>
    )
}