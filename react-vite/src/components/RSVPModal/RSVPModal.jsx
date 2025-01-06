import './RSVPModal.css';
import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { thunkAllUsers } from '../../redux/user';

export default function RSVPModal({navigate, eventId}) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [userId, setUserId] = useState("");
    let [targetEventId, setEventId] = useState(eventId);
    
    useEffect(() => {
        dispatch(thunkAllUsers());
    }, [dispatch])

    const user = useSelector(state=>state.session.user);

    const handleClick = e => {
        e.preventDefault();

        const payload = {
            user_id: user.id,
            event_id: targetEventId
        }

        // need create rsvp thunk
        return dispatch()
            .then(closeModal)
            .then(navigate(`/events/${eventId}`))
    }

    return (
        <div className='confirm-rsvp-modal'>
            <h1>Confirm RSVP for:</h1>
            <h3>Event Name?</h3>
            <button 
            onClick={handleClick} 
            id='yes'
            aria-label='rsvp-yes' 
            >Yes (I plan to attend)</button>
            <button 
            onClick={closeModal} 
            id='yes'
            aria-label='close-modal' 
            >No (Go Back)</button>
        </div>
    )
}