import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupInvites } from "../../redux/invites";
import { fetchAllRequests } from "../../redux/requests";



function Notification() {
    const dispatch = useDispatch();

    const sessionUser = useSelector(state => state.session.user)

    const user_id = sessionUser.id

    useEffect(() => {
        dispatch(fetchGroupInvites(user_id));
        dispatch(fetchAllRequests())

    }, []);

    const invites = useSelector(state => state.invite)
    console.log("notifications invites", invites)
    const requests = useSelector(state => state.requests)
    console.log( requests)

    const receive = Object.values(requests.received)

    
    // const sent = Object.values(requests.sent)

    const totalRequests = Object.keys(requests.received).filter(key => !requests.received[key].accepted).length
    
    const totalInvites = invites.length

    console.log("REQUESTS", totalRequests)
    console.log("INVITES", totalInvites)
    return (
        <div>
            <h1>
            Notifications: {totalInvites + totalRequests}
            </h1>
            <div>
                <h2>Requests</h2>
                Received: {receive.filter(request => !request.accepted).map(received => (
                    <>{received.sender_name}  </>
                ))}
                {/* , Sent: {sent.map(sent => (
                    <>{sent.receiver_name}</>
                ))} */}
            </div>
            <div>
                <h2>Group Invites</h2>
                Received: {invites.map(invite => (
                    <>{invite.sender} - {invite.event_name}</>
                ))}
            </div>
        </div>

    )
}

export default Notification