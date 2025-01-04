// //custom selector
// import { createSelector } from 'reselect';

// export const getEvents = createSelector(
//     (state) => state.events.events
//     (allEvents) => Object.values(allEvents)
// )

//token verification
import { csrfFetch } from './csrf'

//action-type creators
const LOAD_EVENTS = 'session/LOAD_EVENTS';
const RECEIVE_EVENT = 'session/RECEIVE_EVENT';

//action-creators
export const load = (events, upcoming) => ({
    type: LOAD_EVENTS,
    events,
    upcoming
});

export const receive = (event) => ({
    type: RECEIVE_EVENT,
    event
});

//thunk actions

export const getAllEvents = () => async dispatch => {
    const res = await csrfFetch('/api/events')

    // console.log('WE HAVE THUNK')

    if( res.status === 200 ){

        const events = await res.json();

        // console.log('EVENTS HAVE BEEN FOUND  ----->', events.events)
        dispatch(load(events.events, null));
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

export const addOrgFeedback = (feedback, eventId) => async dispatch => {
    const res = await fetch("/api/prfoile/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(feedback)
      });

    if ( res.status === 201 ) {
        // console.log('I AM IN THUNK')
        const newFeedback = await res.json();

        // console.log('FEEDBACK HAS BEEN MADE  ----->', newFeedback)
        const res = await fetch(`/api/events/${eventId}`);
        if (res.status === 200) {
            const event = await res.json()
            dispatch(receive(event))
        }
        return newFeedback;
    } else {
        const errors = res.errors;

        // console.log('IM THE PROBLEM HELLO')

        return errors;
    }
};

export const getAllUpcomingEvents = () => async dispatch => {
    const res = await csrfFetch('/api/profile/rsvps')

    if( res.status === 200 ){

        const events = await res.json();

        // console.log('EVENTS HAVE BEEN FOUND  ----->', events)
        dispatch(load(null, events.rsvps));
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
const initialState = {events: {}, upcoming: {}, single: {}}
const eventsReducer = (state = initialState, action) => {
    switch(action.type) {
        case LOAD_EVENTS:{
            // console.log('IN REDUCER -->',action.events)
            const eventState = {...state}
                if (action.events) eventState.events = normalData(action.events)

                if (action.upcoming) eventState.upcoming = normalData(action.upcoming)

                return eventState;
             }
        case RECEIVE_EVENT: {
            // console.log('DO I MAKE IT ?', action.event)
            const eventState = { ...state}
            eventState.single[action.event.event.id] = action.event

            return eventState
        }
        default:
            return state
    }
}

export default eventsReducer;