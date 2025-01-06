import './FriendsPage.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as friendActions from '../../redux/friends';
import { fetchCurrentUser } from '../../redux/user';

import { friendTile } from '../AllFriends/AllFriends';


export default function FriendsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentUser = useSelector(state=>state.session.user);

    useEffect(() => {
        dispatch(fetchCurrentUser());
        dispatch(friendActions.thunkAllFriends())
    }, [dispatch]);


   if(!currentUser) navigate('/');

    const friends = Object.values(useSelector(state=>state.friends.allFriends));


    return (
        <div className='all-friends'>
            <h1>Friends List</h1>
            <div className='tile-container'>
                <div className='tiles'>
                    {friends && friends.map(friend=>(
                    friendTile(friend)
                    ))}
                </div>
            </div>
        </div>
    )
}
