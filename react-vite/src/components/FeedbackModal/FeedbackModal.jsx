import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { addOrgFeedback } from "../../redux/event";
import FeedbackRatingInput from "../FeedbackRatingInput/FeedbackRatingInput";
import './FeedbackModal.css';

const FeedbackFormModal = ({ eventId, organizer }) => {
    const [reaction, setReaction] = useState(0);
    const [disabled, setDisabled] = useState(true);

    const [errors, setErrors] = useState({});


    const { closeModal } = useModal();

    const dispatch = useDispatch();

    const onChange = (num) => {
        setReaction(parseInt(num));
      };

    useEffect(() => {
        if(reaction > 0) setDisabled(false);
    }, [disabled, reaction])

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            reaction,
            organizer_id: organizer.id
        };

        return dispatch(addOrgFeedback(payload, eventId))
        .then(closeModal)
        .catch(async (res) => {
        const data = await res.json();
        if ( data ) {
            setErrors(data);
        }
        });
    }
    return (
        <>
        <div className='modal'>
        <div className="modal-text">
        <h1>How was working with {organizer.name}?</h1>
        <p>Send feedback to the event organizers!</p>
        <p>What emoji best fits your experience?</p>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="errors">{errors.message}</div>
            <div className="stars-input">
            <label>
                <FeedbackRatingInput
                disabled={false}
                onChange={onChange}
                className='feedback-input'
                rating={reaction}
                 />
                 {/* Stars */}
            </label>
            </div>
            <div className='feedback-button'>
            <button type="Submit" disabled={disabled} className={disabled ? 'off' : 'on'}>Submit Feedback</button>
            </div>
        </form>
        </div>
        </>
    )

};

export default FeedbackFormModal;