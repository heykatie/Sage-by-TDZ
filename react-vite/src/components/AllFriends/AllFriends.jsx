import './AllFriends.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import * as friendActions from '../../redux/friends';
import { IoIosMore } from "react-icons/io";
import {
    fetchCurrentUser,
    fetchUserEvents,
    fetchUserBadges,
    fetchUserFriends,
    fetchUserGroups,
} from '../../redux/user';

export const FriendTile = friend => {
    return (
        <div className='friend-tile' key={friend?.id}>
            <img className='profile-pic' src={friend?.profile_pic}  />
            <Link 
            to={`/friends/${friend?.id}`}
            className='friend-link' 
            >
            <h3 className='friend-name'>{friend?.first_name} {friend?.last_name}</h3>
            </Link>
            <IoIosMore className='more-dots' />
        </div>
    )
}


export default function AllFriends() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(state=>state.session.user);

    useEffect(() => {
        dispatch(fetchCurrentUser());
        dispatch(fetchUserEvents());
        dispatch(fetchUserBadges());
        dispatch(fetchUserFriends());
        dispatch(fetchUserGroups());
        dispatch(friendActions.thunkAllFriends())
    }, [dispatch]);

   if(!currentUser) navigate('/');

    const friends = Object.values(useSelector(state=>state.friends.allFriends));


    return (
        <div className='all-friends'>
            <h3>Friends</h3>
            <div className='tile-container'>
                <div className='tiles'>
                    {friends && friends.map(friend=>(
                    FriendTile(friend)
                    ))}
                </div>
            </div>
        </div>
    )
}
