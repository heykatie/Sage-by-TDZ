import './AllFriends.css';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as friendActions from '../../redux/friends';
import { IoIosMore } from "react-icons/io";



export default function AllFriends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(friendActions.thunkAllFriends())
    }, [dispatch]);

    const friendTile = friend => {
        return (
            <div className='friend-tile' key={friend.id}>
                <Link 
                to={`/friends/${friend.id}`} 
                >
                <img src={friend.profile_pic} />
                <h2>{friend.first_name} {friend.last_name}</h2>
                <IoIosMore />
                </Link>
            </div>
        )
    }

    const friends = Object.values(useSelector(state=>state.friends.allFriends));


    return (
        <div className='all-friends'>
            {friends && friends.map(friend=>(
                friendTile(friend)
            ))}
        </div>
    )
}
