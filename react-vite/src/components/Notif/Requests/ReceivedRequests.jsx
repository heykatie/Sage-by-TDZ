import { useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as requestActions from '../../../redux/requests';

const ReceivedRequests = () => {
    const dispatch = useDispatch()
    const {sent, received} = useSelector(state => state.requests)
    const[action, setAction] = useState('')

    useEffect(() => {
        dispatch(requestActions.fetchAllRequests())
    }, [])
    const handleSumbit = () => {
        e.preventDefault()

        if (action === 'delete') dispatch(requestActions.removeRequest())

        dispatch(requestActions.createRequest())
    }
    return (
        <section id='received-requests' className='requests'>
            {/* {console.log('SENT HERE',sent, 'RECEIVE HERE', received)} */}
            <h3>Requests</h3>
            <div className='request-list'>
                {received?.length > 0 ? (
                    received.map((received, index) => (
                        <div className='request' key={index}>
                            <div className='request-photo'>
                            <img src={received.sender_pic} alt={`Request ${index}`} />
                            </div>
                            <div className='request-text'>
                            <p>{received.sender_name} has sent you a friend request!</p>
                            </div>
                            <div className='request-buttons'>
                            {received.accepted ?
                                (<button onClick={setAction('delete')}>X</button>)
                                :
                                (
                                <>
                                <button className='button-yes' onClick={setAction('add')} onSubmit={handleSumbit}>Accept</button>
                                <button className='button-no' onClick={setAction('delete')} onSubmit={handleSumbit}>Decline</button>
                                </>
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