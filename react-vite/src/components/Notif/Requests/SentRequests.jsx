import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as requestActions from '../../../redux/requests';
import { TbHeartHandshake } from "react-icons/tb";
import './Requests.css';
import { IoClose } from "react-icons/io5";

const SentRequests = () => {
    const dispatch = useDispatch()
    const data = useSelector(state => state.requests.sent)
    const sent = Object.values(data)

    useEffect(() => {
        dispatch(requestActions.fetchAllRequests())
    }, [dispatch])

    const handleSumbit = (e) => {
        e.preventDefault()
        dispatch(requestActions.removeRequest())
    }

    return (
        <section id='sent-requests' className='requests'>
            <h3>Sent Requests</h3>
            <div className='request-list'>
                {sent?.length > 0 ? (
                    sent.map((sent, index) => (
                        <div className='request' key={index}>
                            <div className='sender-div'>
                               <div className='request-photo'>
                                <img className='profile-pic' id='request' src={sent.sender_pic} alt={`Request ${index}`} />
                                </div>
                                <div className='request-text'>
                                <p>{sent.receiver_name} has received your friend request!</p> 
                            </div>
                            
                            </div>
                            {
                                sent.status ?
                                (
                                    <div className='request-status'>
                                        <TbHeartHandshake id='request-status-icon' />
                                        <p>Accepted!</p>
                                    </div>
                                )
                                :
                                (
                                    <div className='request-buttons'>
                                        <button onClick={handleSumbit}>Remove Request<IoClose /></button>
                                    </div>
                                )
                            }
                        </div>
                    ))
                ) : (
                    <p>No requests yet</p>
                )}
            </div>
        </section>
    );
}

export default SentRequests