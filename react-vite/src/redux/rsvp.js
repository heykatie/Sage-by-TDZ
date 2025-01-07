//token verification
import { csrfFetch } from './csrf'

//action-type creators
const LOAD_RSVPS = 'session/LOAD_RSVPS';

//action-creators
export const loadRSVPs = (payload) => ({
    type: LOAD_RSVPS,
    payload
});

//thunks
export const thunkUserRSVPs = () => async dispatch => {
    const res = await csrfFetch('/api/profile/rsvps')

    if( res.ok ){
        const data = await res.json();
        dispatch(loadRSVPs(data))
    } else {
        const errors = res.errors;
        return errors;
    }
};


//reducer
const initialState = { userRsvps: {} }
const rsvpsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_RSVPS:{
            const newState = { ...state, userRsvps: {} }
            newState.userRsvps = action.payload
            return newState;
        }
        default:
            return state
    }
}

export default rsvpsReducer;