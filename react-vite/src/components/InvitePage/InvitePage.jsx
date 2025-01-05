import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchGroupInvites } from "../../redux/invites";


function GroupInvite({ invite }){
    console.log(invite)
    return (
        <div>
            <p>{invite}</p>
        </div>
    )
}


function GroupInvites() {
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.user)

    console.log('user', sessionUser)

    useEffect(() => {
        dispatch(fetchGroupInvites() )
    }, []);

    const invites = useSelector(state => state.invite);
    console.log("what is going on with you", invites)
    return (
        <div className="group-invite-container">
            {invites.map(invite => (
                <GroupInvite key={invite.id} invite={invite}/>
            ))}
        </div>
    )
}

export default GroupInvites