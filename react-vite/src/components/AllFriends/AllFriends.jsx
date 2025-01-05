import './AllFriends.css';
import { useEffect, useState } from 'react';
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



export default function AllFriends() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile } = useSelector((state) => state.user);
    const currentUser = useSelector(state=>state.session.user);
    
    const [activeSection, setActiveSection] = useState('friends');

    useEffect(() => {
        dispatch(fetchCurrentUser());
        dispatch(fetchUserEvents());
        dispatch(fetchUserBadges());
        dispatch(fetchUserFriends());
        dispatch(fetchUserGroups());
        dispatch(friendActions.thunkAllFriends())
    }, [dispatch]);

   

   if(!currentUser) navigate('/');

    const friendTile = friend => {
        return (
            <div className='friend-tile' key={friend.id}>
                <Link 
                to={`/friends/${friend.id}`}
                className='friend-link' 
                >
                <img className='profile-pic' src={friend.profile_pic} />
                <h3 className='friend-name'>{friend.first_name} {friend.last_name}</h3>
                <IoIosMore className='more-dots' />
                </Link>
            </div>
        )
    }

    const friends = Object.values(useSelector(state=>state.friends.allFriends));


    return (
        <div className='all-friends'>
            <section className='user-info'>
            <div className='profile-picture'>
                <img
                    src={profile?.profile_pic || '/default-avatar.png'}
                    alt='Profile'
                />
                <button className='edit-profile-button' onClick={() => setActiveSection('edit-profile')}>
                    Edit Profile
                </button>
            </div>
            <div className='dashboard-title'>
                <h2>
                    {profile?.first_name} {profile?.last_name} Dashboard
                </h2>
                <p>
                    {profile?.city}, {profile?.state}
                </p>
                <nav>
                    <button
                        className={activeSection === 'badges' ? 'active' : ''}
                        onClick={() => setActiveSection('badges')}>
                        Badges
                    </button>
                    <button
                        className={activeSection === 'events' ? 'active' : ''}
                        onClick={() => setActiveSection('events')}>
                        Events
                    </button>
                    <button
                        className={activeSection === 'friends' ? 'active' : ''}
                        onClick={() => setActiveSection('friends')}>
                        Friends
                    </button>
                    <button
                        className={activeSection === 'groups' ? 'active' : ''}
                        onClick={() => setActiveSection('groups')}>
                        Groups
                    </button>
                </nav>
            </div>
            </section>
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
