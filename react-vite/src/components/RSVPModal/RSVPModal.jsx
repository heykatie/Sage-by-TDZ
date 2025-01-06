import './RSVPModal.css';
import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { thunkAllUsers } from '../../redux/user';
const sproutImage = 'https://i.postimg.cc/jdK73WSg/sprout.png'; // Sprout image

export default function RSVPModal({navigate, eventId}) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    let [targetEventId] = useState(eventId);

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
        <div className='login-form-modal' id='rsvp-modal'>
            <div className='delete-modal-header'>
					<img
						src={sproutImage}
						alt='Sprout'
						className='sprout-icon-left'
					/>
					<h1>Confirm RSVP</h1>
					<img
						src={sproutImage}
						alt='Sprout'
						className='sprout-icon-right'
					/>
				</div>
            {/* <h3>Event Name?</h3> */}
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