import './RemoveRSVPModal.css';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { thunkDeleteRSVP, thunkGetRSVPs } from '../../redux/events';
import { useEffect } from 'react';

export default function RemoveRSVPModal({navigate, eventId, rsvps, currentUser}) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetRSVPs(eventId))
    }, [dispatch, eventId])

    const targetRsvp = rsvps.filter(r=>r.user_id===currentUser.id);

    const handleClick = e => {
        e.preventDefault();

        // need delete rsvp thunk
        return dispatch(thunkDeleteRSVP(eventId, targetRsvp.id))
            .then(closeModal)
            .then(navigate(`/events/${eventId}`))
    }

    return (
        <div className='remove-rsvp-modal'>
            <h1>Remove RSVP for:</h1>
            <h3>Event Name?</h3>
            <button 
            onClick={handleClick} 
            id='remove-yes'
            aria-label='remove-rsvp-I-do-not-plan-to-attend' 
            >Remove RSVP (I do not plan to attend)</button>
            <button 
            onClick={closeModal} 
            id='no-go-back'
            aria-label='close-modal' 
            >No (Go Back)</button>
        </div>
    )
}