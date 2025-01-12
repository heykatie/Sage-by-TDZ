import { csrfFetch } from "./csrf";

const GET_EVENTS = 'events/getEvents';
const SINGLE_EVENT = 'events/singleEvent';
const EVENT_RSVPS = 'events/rsvps';
const CREATE_RSVP = 'events/createRsvp';
const DELETE_RSVP = 'events/deleteRsvp';


const getEvents = payload => ({
    type: GET_EVENTS,
    payload
});

const getSingleEvent = payload => ({
    type: SINGLE_EVENT,
    payload
})

const getEventRSVPs = payload => ({
    type: EVENT_RSVPS,
    payload
});

const createRsvp = payload => ({
    type: CREATE_RSVP,
    payload
})

const deleteRsvp = id => ({
    type: DELETE_RSVP,
    payload: id
})

export const thunkAllEvents = () => async dispatch => {
    const res = await csrfFetch('/api/events');

    if(res.ok) {
        const events = await res.json();
        if (events.errors) { return; }

        dispatch(getEvents(events));
    } else throw new Error('Failed to fetch')
}

export const thunkSingleEvent = eventId => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}`);

    if(res.ok) {
        const event = await res.json();
        if(event.errors) { return; }

        dispatch(getSingleEvent(event));
    }
}

export const thunkGetRSVPs = eventId => async dispatch => {
    const res = await csrfFetch(`/api/events/${eventId}/rsvps`);

    if(res.ok) {
        const rsvps = await res.json();
        if(rsvps.errors) { return; }

        dispatch(getEventRSVPs(rsvps));
    }
}

export const thunkCreateRSVP = (eventId, data) => async dispatch => {
    const res = await csrfFetch(`/api/events/${+eventId}/rsvps`, {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
      });
    if(res.ok) {
        const rsvp = await res.json();
        if(rsvp.errors) { return; }
        dispatch(createRsvp(rsvp));
        window.location.reload();
    }
}

export const thunkDeleteRSVP = (rsvpId) => async dispatch => {
    const res = await fetch(`/api/rsvps/${rsvpId}/delete`, {
        method: "DELETE",
      });
    if(res.ok) {
        dispatch(deleteRsvp(rsvpId));
        window.location.reload();
    }
}

const initialState = { allEvents: {}, event: {}, rsvps: {}}

export default function eventReducer(state = initialState, action) {
    switch(action.type){
        case GET_EVENTS: {
            const newState = { ...state, allEvents: {}};
            const eventsArr = action.payload.events;
            eventsArr.forEach(event=>{
                newState.allEvents[event.id] = event;
            })
            return newState;
        }
        case SINGLE_EVENT: {
            const newState = { ...state, event: {}};
            const event = action.payload;
            newState.event[event.event.id] = event;
            return newState
        }
        case EVENT_RSVPS: {
            const newState = {...state, rsvps: {}};
            const rsvpsArr = action.payload.RSVPs;
            rsvpsArr.forEach(rsvp=>{
                newState.rsvps[rsvp.id] = rsvp;
            })
            return newState;
        }
        case CREATE_RSVP: {
            const newState = {
                rsvps: {
                    ...state.rsvps,
                    [action.payload.id]: action.payload
                }
            }
            return newState;
        }
        case DELETE_RSVP: {
            const newState = {...state};
            delete newState.rsvps[action.payload];
            return newState;
        }
        default:
            return state
    }
}