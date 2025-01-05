import { thunkGetRSVPs } from '../../redux/rsvp';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './AllAttendees.css';

export default function AllAttendees({eventId}) {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(thunkGetRSVPs(eventId))
        // setisLoaded(true)
    }, [dispatch, eventId])

    const rsvps = (useSelector(state => state.event.rsvps))
    return (
        <>
        {console.log(rsvps)}
        <h1>Attendees Here</h1>
        </>
    )
}