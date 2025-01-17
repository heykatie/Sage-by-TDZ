import { csrfFetch } from "./csrf";

const initialState = [];

const LOAD_INVITES = "LOAD_INVITES";
const ADD_INVITE = "ADD_INVITE";
const UPDATE_INVITE = "UPDATE_INVITE";
const DELETE_INVITE = "DELETE_INVITE";
const LOAD_INVITED_FRIENDS = 'invites/LOAD_INVITED_FRIENDS';

export const loadInvitedFriends = (invites) => ({
	type: LOAD_INVITED_FRIENDS,
	invites,
});

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

// const deleteInvites = (invite) => ({
//     type: DELETE_INVITE,
//     invite
// })

export const fetchInvitedFriends = (groupId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/groups/${groupId}/invites`, {
			method: 'GET',
			credentials: 'include',
        });
		if (!response.ok) {
			throw new Error('Failed to fetch invited friends');
		}
		const data = await response.json();
		dispatch(loadInvitedFriends(data.invites || []));
	} catch (error) {
		console.error('Error fetching invited friends:', error); // Show exact error
	}
};

export const fetchUserInvites = () => async (dispatch) => {
    const response = await csrfFetch('api/invites/');
    if (response.ok) {
        const invites = await response.json();
        dispatch(loadInvites(invites))
    }
}

export const fetchGroupInvites = (userId) => async (dispatch) => {
    const response = await csrfFetch(`/api/invites/${userId}`);
    if (response.status === 200) {
        const invites = await response.json();
        dispatch(loadInvites(invites))
    }
}

export const createInvite = (invite) => async (dispatch) => {
	try {
		const response = await csrfFetch('/api/invites/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(invite),
		});

		if (response.ok) {
			const newInvite = await response.json();
			dispatch(addInvite(newInvite)); // Add the actual new invite returned
			return newInvite;
		} else {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Failed to create invite');
		}
	} catch (error) {
		console.error('Error creating invite:', error);
		throw error;
	}
};

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

// export const deleteInvite = (invite) => async (dispatch) => {
//     const response = await csrfFetch(`api/invite/${invite.id}`, {
//         method: 'DELETE',
//     })
//     if (response.ok) {
//         dispatch(deleteInvites(invite.id))
//     }
// }

export const deleteInvite = (inviteId) => async (dispatch) => {
	try {
		if (!inviteId) {
			console.error('Invite ID is undefined before API call.');
			return;
		}

		const response = await csrfFetch(`/api/invites/${inviteId}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			dispatch({ type: DELETE_INVITE, payload: inviteId }); // payload should be inviteId
		} else {
			const errorData = await response.json();
			throw new Error(errorData.message || 'Failed to delete invite');
		}
	} catch (error) {
		console.error('Error deleting invite:', error);
	}
};


const inviteReducer = ( state = initialState, action) => {
    switch (action.type) {
        case LOAD_INVITED_FRIENDS:
            return [...action.invites];
        case LOAD_INVITES:
            return [...action.invites];
        case ADD_INVITE:
            return [...state, action.invite];
        case UPDATE_INVITE:
            return state.map((invite) =>
                invite.id === action.invite.id ? action.invite : invite
            );
        case DELETE_INVITE:
            if (!action.payload) {
                console.error('No invite ID provided for deletion!');
                return state;
            }
            return state.filter((invite) => invite.id !== action.payload);
        default:
            return state;
    }
}

export default inviteReducer