import './EventRSVPs.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { thunkSingleEvent, thunkGetRSVPs } from '../../redux/events';
import { thunkAllUsers } from '../../redux/user';
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
    }, [dispatch, eventId]);

    const event = Object.values(useSelector(state=>state.event.event));
    const rsvps = Object.values(useSelector(state=>state.event.rsvps));
    const users = useSelector(state=>state.user.users);

    console.log(users)

    const rsvpTile = r => {
        return (
            <div key={r.id}>
                <img src={users && users[r.user_id].profile_pic} />
                <h3>{users && users[r.user_id].first_name}</h3>
                <IoIosMore />
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
