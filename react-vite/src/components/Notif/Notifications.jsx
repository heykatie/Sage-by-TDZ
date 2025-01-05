import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { fetchGroupInvites } from "../../redux/invites";



function notification() {
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(fetchGroupInvites())

    }, []);

    const invites = useSelector(state => state.invites)

    return (
        <>
        </>
    )
}