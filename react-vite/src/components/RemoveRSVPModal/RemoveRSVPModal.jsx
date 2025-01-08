import './RemoveRSVPModal.css';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { thunkDeleteRSVP, thunkGetRSVPs } from '../../redux/events';
import { useEffect } from 'react';

export default function RemoveRSVPModal({navigate, eventId, rsvps, currentUser, eventInfo}) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkGetRSVPs(eventId))
    }, [dispatch, eventId])

    const targetRsvp = rsvps.filter(r=>r.user_id === currentUser.id);
    console.log(targetRsvp[0]?.id)

    const handleClick = e => {
        e.preventDefault();

        // need delete rsvp thunk
        return dispatch(thunkDeleteRSVP(targetRsvp[0]?.id))
            .then(closeModal)
            .then(navigate(`/events/${eventId}`))
    }

    return (
        <div className='login-form-modal' id='remove-rsvp-modal'>
            <h2>Remove RSVP for:</h2>
            <h3>{eventInfo?.event.title} ?</h3>
            <button 
            onClick={handleClick} 
            id='yes'
            aria-label='remove-rsvp-I-do-not-plan-to-attend' 
            >
            Remove RSVP 
            (I do not plan to attend)</button>
            <button 
            onClick={closeModal} 
            id='reverse'
            aria-label='no-go-back' 
            >No (Go Back)</button>
        </div>
    )
}