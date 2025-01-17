import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as requestActions from '../../../redux/requests';
import { TbHeartHandshake } from "react-icons/tb";
import './Requests.css';

const ReceivedRequests = () => {
    const dispatch = useDispatch()
    const data = useSelector(state => state.requests.received)
    const received = Object.values(data)
    // const[response, setResponse] = useState()

    useEffect(() => {
        dispatch(requestActions.fetchAllRequests())
    }, [dispatch])

    const handleClick = () => alert('Feature coming soon...');


    return (
        <section id='received-requests' className='requests'>
            <h3>Received Requests</h3>
            <div className='request-list'>
                {received?.length > 0 ? (
                    received.map((received, index) => (
                        <div className='request' key={index}>
                            <div className='sender-div'>
                               <div className='request-photo'>
                                <img className='profile-pic' id='request' src={received.sender_pic} alt={`Request ${index}`} />
                                </div>
                                <div className='request-text'>
                                <p>{received.sender_name} has sent you a friend request!</p>
                                </div> 
                            </div>
                            
                            <div className='request-buttons'>
                            {received.accepted ?
                                (
                                    <>
                                        <button 
                                        className='button-yes'
                                        onClick={handleClick} 
                                        >Accept</button>
                                        <button
                                        onClick={handleClick} 
                                        className='button-no' 
                                        id='reverse'
                                        >Decline</button>
                                    </>
                                ):(
                                    <div className='request-status'>
                                        <TbHeartHandshake id='request-status-icon' />
                                        <p>Accepted!</p>
                                    </div>
                                )
                                
                            }
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No requests yet</p>
                )}
            </div>
        </section>
    );
}

export default ReceivedRequests