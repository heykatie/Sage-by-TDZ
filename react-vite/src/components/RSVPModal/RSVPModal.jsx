import './RSVPModal.css';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { thunkAllUsers } from '../../redux/user';
import { thunkCreateRSVP } from '../../redux/events';
const sproutImage = 'https://i.postimg.cc/jdK73WSg/sprout.png'; // Sprout image

export default function RSVPModal({navigate, eventId}) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkAllUsers());
    }, [dispatch])

    const handleClick = e => {
        e.preventDefault();

        const data = { event_id: +eventId }

        // need create rsvp thunk
        return dispatch(thunkCreateRSVP(eventId, data))
            .then(closeModal)
            .then(navigate(`/events/${+eventId}`))
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