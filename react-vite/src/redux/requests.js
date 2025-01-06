import { csrfFetch } from "./csrf";

const LOAD_REQUESTS = "LOAD_REQUESTS";
const ADD_REQUEST = "ADD_REQUEST";
const DELETE_REQUEST = "DELETE_REQUEST";

const loadRequests = (sent, received) => ({
    type: LOAD_REQUESTS,
    sent,
    received
});

const addRequest = (request) => ({
    type: ADD_REQUEST,
    request
});

const deleteRequest = (requestId) => ({
    type: DELETE_REQUEST,
    requestId
})

export const fetchAllRequests = () => async (dispatch) => {
    const response = await csrfFetch('/api/requests/');
    // console.log('hello from THUNK')
    if (response.ok) {
        const requests = await response.json();
        // console.log('I AM YOUR REQUESTS', requests)
        dispatch(loadRequests(requests.sent_requests, requests.received_requests))
    }
}

export const fetchGroupInvites = (user_id) => async (dispatch) => {
    const response = await csrfFetch(`/api/reuqests/${user_id}`);
    if (response.ok) {
        const invites = await response.json();
        dispatch(loadInvites(invites))
    }
}

export const createRequest = (request) => async (dispatch) => {
    const response = await csrfFetch('/api/requests/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    });

    if (response.ok){
        const newRequest = await response.json();
        dispatch(addRequest(request))

        return newRequest
    } else {
        const errorData = await response.json();
        throw errorData
    }

}

export const updateRequest = (requestId, payload) => async (dispatch) => {
    const response = await csrfFetch(`/api/requests/${requestId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    if (response.ok){
        const newRequest = await response.json();
        dispatch(addRequest(newRequest))

        return newRequest
    } else {
        const errorData = await response.json();
        throw errorData
    }

}

export const removeRequest = (requestId) => async (dispatch) => {
    const response = await csrfFetch(`/api/requests/${requestId}`, {
        method: 'DELETE',
    })
    if (response.ok) {
        const response = await csrfFetch(`api/requests/`)
        if(response.ok){
            const requests = response.json()
            dispatch(loadRequests(requests.sent_requests, requests.received_requests))
        }

    }
}

const normalData = (data) => {
    const normalData = {}
    data.forEach((event) => {
        normalData[event.id] = event
    })

    return normalData
}

const initialState = {sent: {}, received: {}};

const requestReducer = ( state = initialState, action) => {
    switch (action.type){
        case LOAD_REQUESTS:{
            const requestState = {...state}
            if (action.sent) requestState.sent = normalData(action.sent)

            if (action.received) requestState.received = normalData(action.received)

            return requestState;
        }
        case ADD_REQUEST:{
            const requestState = {...state}
            requestState.received[action.request.id] = action.request

            return requestState;
        }
        default:
            return state;
    }
}

export default requestReducer