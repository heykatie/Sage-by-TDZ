// //custom selector
// import { createSelector } from 'reselect';

// export const getEvents = createSelector(
//     (state) => state.events,
//     (allEvents) => Object.values(allEvents)
// )

//token verification
import { csrfFetch } from './csrf'

//action-type creators
const LOAD_EVENTS = 'session/LOAD_EVENTS';
const RECEIVE_EVENT = 'session/RECEIVE_EVENT';

//action-creators
export const load = (events) => ({
    type: LOAD_EVENTS,
    events
});

export const receive = (event) => ({
    type: RECEIVE_EVENT,
    event
});

//thunk actions
export const getAllEvents = () => async dispatch => {
    const res = await csrfFetch('/api/events/')

    if( res.status === 200 ){

        const events = await res.json();

        // console.log('EVENTS HAVE BEEN FOUND  ----->', events)
        dispatch(load(events.events));
        return null;
    } else {
        const errors = res.errors;
        // console.log('IM A PROBLEM', errors)
        return errors;
    }
};

export const singleEvent = (id) => async dispatch => {
    const res = await csrfFetch(`/api/events/${id}`)

    if ( res.status === 200 ) {
        // console.log('I AM IN THUNK')
        const info = await res.json();

        // console.log('EVENT HAS BEEN FOUND  ----->', info)
        dispatch(receive(info));
        return info;
    } else {
        const errors = res.errors;

        // console.log('IM THE PROBLEM HELLO')

        return errors;
    }
};

//move to rsvps reducer

export const addOrgFeedback = (feedback) => async dispatch => {
    const res = await fetch("/api/profile/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback)
      });

    if ( res.status === 200 ) {
        // console.log('I AM IN THUNK')
        const info = await res.json();

        // console.log('FEEDBACK HAS BEEN MADE  ----->', info)
        dispatch(receive(info));
        return info;
    } else {
        const errors = res.errors;

        // console.log('IM THE PROBLEM HELLO')

        return errors;
    }
};


//reducer
const eventsReducer = (state = {}, action) => {
    switch(action.type) {
        case LOAD_EVENTS:{
            const eventState = {};
            // console.log('DO I MAKE IT ?', action.events)
            action.events.forEach((event) => {
                eventState[event.id] = event;
            });
            return eventState;
        }
        case RECEIVE_EVENT:
            return { ...state, [action.event.id]: action.event }

        default:
            return state
    }
}

export default eventsReducer;