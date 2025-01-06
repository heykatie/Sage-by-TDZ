import { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as requestActions from '../../../redux/requests';
import { TbHeartHandshake } from "react-icons/tb";

const SentRequests = () => {
    const dispatch = useDispatch()
    const {sent, received} = useSelector(state => state.requests)

    useEffect(() => {
        dispatch(requestActions.fetchAllRequests())
    }, [])
    return (
        <section id='sent-requests' className='requests'>
            {/* {console.log('SENT HERE',sent, 'RECEIVE HERE', received)} */}
            <h3>Requests</h3>
            <div className='request-list'>
                {sent?.length > 0 ? (
                    sent.map((sent, index) => (
                        <div className='request' key={index}>
                            <div className='request-photo'>
                            <img src={sent.sender_pic} alt={`Request ${index}`} />
                            </div>
                            <div className='request-text'>
                            <p>{sent.sender_name} has received your friend request!</p>
                            </div>
                            <div className='request-status'>
                                <TbHeartHandshake className={sent.status? 'filled' : 'empty'} />
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

export default SentRequests