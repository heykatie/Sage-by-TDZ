import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as requestActions from '../../../redux/requests';
import { TbHeartHandshake } from "react-icons/tb";
import './Requests.css';

const SentRequests = () => {
    const dispatch = useDispatch()
    const data = useSelector(state => state.requests.sent)
    const sent = Object.values(data)

    // console.log('LOOK HERE',sent)

    useEffect(() => {
        dispatch(requestActions.fetchAllRequests())
    }, [])

    const handleSumbit = () => {
        e.preventDefault()

        dispatch(requestActions.removeRequest())
    }

    return (
        <section id='sent-requests' className='requests'>
            {/* {console.log('SENT HERE',sent, 'RECEIVE HERE', received)} */}
            <h3>Sent Requests</h3>
            <div className='request-list'>
                {sent?.length > 0 ? (
                    sent.map((sent, index) => (
                        <div className='request' key={index}>
                            <div className='request-photo'>
                            <img src={sent.sender_pic} alt={`Request ${index}`} />
                            </div>
                            <div className='request-text'>
                            <p>{sent.receiver_name} has received your friend request!</p>
                            </div>
                            {
                                sent.status ?
                                (
                                    <div className='request-status'>
                                        <TbHeartHandshake id='request-status-icon' />
                                    </div>
                                )
                                :
                                (
                                    <div className='request-buttons'>
                                        <button onClick={handleSumbit}>X</button>
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