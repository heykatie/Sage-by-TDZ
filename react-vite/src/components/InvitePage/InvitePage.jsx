import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchGroupInvites } from "../../redux/invites";


function GroupInvite({ invite }){
    return (
        <div>
            <p>{invite}</p>
        </div>
    )
}


function GroupInvites() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);

    useEffect(() => {
        dispatch(fetchGroupInvites(sessionUser.id))
    }, [dispatch, sessionUser.id]);

    const invites = useSelector(state => state.invite);

    return (
        <div className="group-invite-container">
            {invites.map(invite => (
                <GroupInvite key={invite.id} invite={invite}/>
            ))}
        </div>
    )
}

export default GroupInvites