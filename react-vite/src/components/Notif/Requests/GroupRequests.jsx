import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as inviteActions from '../../../redux/invites';

const GroupRequests = () => {
    const dispatch = useDispatch()
    const invites = useSelector(state => state.invites)

    useEffect(() => {
        dispatch(inviteActions.fetchGroupInvites())
    }, [])
    return (
        <section id='invites' className='invites'>
            <h3>Invites</h3>
            <div className='invite-grid'>
                {invites?.length > 0 ? (
                    invites.map((invite, index) => (
                        <div className='invite' key={index}>
                            <img src={invite.url} alt={`Invite ${index}`} />
                            <p>{invite.name}</p>
                            <div className='request-buttons'>
                            {invite.going ?
                                (<button onClick={handleSumbit}>X</button>)
                                :
                                (
                                <>
                                <button className='button-yes' onClick={handleSumbit}>Accept</button>
                                <button className='button-no' onClick={handleSumbit}>Decline</button>
                                </>
                                )
                            }
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No invites yet</p>
                )}
            </div>
        </section>
    );
}

export default GroupRequests