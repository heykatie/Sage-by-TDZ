import { csrfFetch } from "./csrf";

const initialState = [];

const LOAD_INVITES = "LOAD_INVITES";
const ADD_INVITE = "ADD_INVITE";
const UPDATE_INVITE = "UPDATE_INVITE";
const DELETE_INVITE = "DELETE_INVITE";

const loadInvites = (invites) => ({
    type: LOAD_INVITES,
    invites
});

const addInvite = (invite) => ({
    type: ADD_INVITE,
    invite
});

const updateInvites = (invite) => ({
    type: UPDATE_INVITE,
    invite
})

const deleteInvites = (invite) => ({
    type: DELETE_INVITE,
    invite
})

export const fetchUserInvites = () => async (dispatch) => {
    const response = await csrfFetch('api/invites/');
    if (response.ok) {
        const invites = await response.json();
        dispatch(loadInvites(invites))
    }
}

export const fetchGroupInvites = (user_id) => async (dispatch) => {
    const response = await csrfFetch(`api/invites/${user_id}`);
    if (response.ok) {
        const invites = await response.json();
        dispatch(loadInvites(invites))
    }
}

export const createInvite = (invite) => async (dispatch) => {
    const response = await csrfFetch('api/invites/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(invite)
    });

    if (response.ok){
        const newInvite = await response.json();
        dispatch(addInvite(invite))

        return newInvite
    } else {
        const errorData = await response.json();
        throw errorData
    }

}

export const updateInvite = (invite) => async (dispatch) => {
    const response = await csrfFetch(`api/invites/${invite.id}`, {
        method: 'PUT',
        headers:  {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(invite)
    })
    if (response.ok) {
        const inviteUpdate = await response.json();
        dispatch(updateInvites(inviteUpdate));
        return inviteUpdate
    }
}

export const deleteInvite = (invite) => async (dispatch) => {
    const response = await csrfFetch(`api/invite/${invite.id}`, {
        method: 'DELETE',
    })
    if (response.ok) {
        dispatch(deleteInvites(invite.id))
    }
}


const inviteReducer = ( state = initialState, action) => {
    switch (action.type){
        case LOAD_INVITES:
            console.log('What happing here', action)
            return [...action.invites]
        case ADD_INVITE:
            return [...state, action.invites];
        case UPDATE_INVITE:
            return state.map( invite => invite.id === action.invite.id ? action.invite : invite)
        case DELETE_INVITE:
            return state.filter(invite => invite.id !== action.invite.id)
        default:
            return state;
    }
}

export default inviteReducer