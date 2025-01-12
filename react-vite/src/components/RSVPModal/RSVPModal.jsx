import './RSVPModal.css';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { thunkAllUsers } from '../../redux/user';
import { thunkCreateRSVP } from '../../redux/events';

export default function RSVPModal({navigate, eventId}) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(thunkAllUsers());
    }, [dispatch])

    const handleClick = e => {
        e.preventDefault();
        let navId;
        if(eventId) {
            navId = +eventId
        }

        const data = { event_id: navId }

        // need create rsvp thunk
        return dispatch(thunkCreateRSVP(navId, data))
            .then(closeModal)
            .then(navigate(`/events/${navId}`))
    }

    return (
        <div className='login-form-modal' id='rsvp-modal'>
            <div className='delete-modal-header'>
					<h1>Confirm RSVP</h1>
				</div>
            {/* <h3>Event Name?</h3> */}
            <button
            onClick={handleClick}
            id='yes'
            aria-label='rsvp-yes'
            >Yes (I plan to attend)</button>
            <button
            onClick={closeModal}
            id='reverse'
            aria-label='close-modal'
            >No (Go Back)</button>
        </div>
    )
}