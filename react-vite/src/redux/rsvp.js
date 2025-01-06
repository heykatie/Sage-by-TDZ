//token verification
import { csrfFetch } from './csrf'

//action-type creators
const LOAD_RSVPS = 'session/LOAD_RSVPS';

//action-creators
export const loadRSVPs = (rsvps) => ({
    type: LOAD_RSVPS,
    rsvps
});

//thunks
export const thunkGetRSVPs = (eventId) => async dispatch => {
    const res = await csrfFetch(`http://127.0.0.1:5000/api/events/rsvps`, {headers: {
        'Accept': 'application/json'
      }})

    // console.log('WE HAVE THUNK')

    if( res.status === 200 ){

        const data = await res.text();

        console.log('rsvps HAVE BEEN FOUND  ----->', data)
        // dispatch(loadRSVPs(data.RSVPs));
        return null;
    } else {
        const errors = res.errors;
        // console.log('IM A PROBLEM', errors)
        return errors;
    }
};

//normailzer
const normalData = (data) => {
    const normalData = {}
    data.forEach((event) => {
        normalData[event.id] = event
    })

    return normalData
}

//reducer
const initialState = {allRsvps: {}}
const rsvpsReducer = (state = initialState, action) => {
    // console.log('IN RSVP REDUCER -->',action.rsvps)
    switch(action.type) {
        case LOAD_RSVPS:{
            // console.log('IN REDUCER -->',action.rsvps)
            const rsvpState = {...state}
            rsvpState.allRsvps = normalData(action.rsvps)
            return rsvpState;
        }
        default:
            return state
    }
}

export default rsvpsReducer;