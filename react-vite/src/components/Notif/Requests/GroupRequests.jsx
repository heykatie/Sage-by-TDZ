import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as inviteActions from '../../../redux/invites';
import './GroupRequests.css';

const GroupRequests = () => {
    const dispatch = useDispatch();
    const invites = useSelector(state => state.invite);
    const user = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(inviteActions.fetchGroupInvites(user.id))
    }, [dispatch, user.id])

    const handleSumbit = () => {}

    return (
        <section id='invites' className='invites'>
            <h3>Group Invites</h3>
            <div className='invite-grid'>
                {invites?.length > 0 ? (
                    invites.map((invite, index) => (
                        <div className='invite' key={index}>
                            <div className='invite-image'>
                            <img src={invite.url} alt={`Invite ${index}`} />
                            </div>
                            <div className='invite-text'>
                            <p>{invite.sender} has invited you to join them at the {invite.event_name}!</p>
                            </div>
                            <div className='request-buttons'>
                            {invite.going ?
                                (<button onClick={handleSumbit}>X</button>)
                                :
                                (
                                <>
                                <button className='button-yes' onClick={handleSumbit}>Accept</button>
                                <button className='button-no' id='reverse' onClick={handleSumbit}>Decline</button>
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