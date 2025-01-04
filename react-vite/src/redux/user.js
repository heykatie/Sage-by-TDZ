import { csrfFetch } from './csrf';

// Action Types
const LOAD_USER = 'user/LOAD_USER';
const LOAD_USER_EVENTS = 'user/LOAD_USER_EVENTS';
const LOAD_USER_BADGES = 'user/LOAD_USER_BADGES';
const LOAD_USER_INVITES = 'user/LOAD_USER_INVITES';
const LOAD_USER_GROUPS = 'user/LOAD_USER_GROUPS';
const LOAD_USER_FRIENDS = 'user/LOAD_USER_FRIENDS';
const SET_STATUS = 'user/SET_STATUS';
const SET_ERROR = 'user/SET_ERROR';

// Action Creators
export const loadUser = (user) => ({
	type: LOAD_USER,
	user,
});

export const loadUserEvents = (events) => ({
	type: LOAD_USER_EVENTS,
	events,
});

export const loadUserBadges = (badges) => ({
	type: LOAD_USER_BADGES,
	badges,
});

export const loadUserInvites = (invites) => ({
	type: LOAD_USER_INVITES,
	invites,
});

export const loadUserGroups = (groups) => ({
	type: LOAD_USER_GROUPS,
	groups,
});

export const loadUserFriends = (friends) => ({
	type: LOAD_USER_FRIENDS,
	friends,
});

export const setStatus = (status) => ({
	type: SET_STATUS,
	status,
});

export const setError = (error) => ({
	type: SET_ERROR,
	error,
});

// Thunk Actions
export const fetchCurrentUser = () => async (dispatch) => {
	dispatch(setStatus('loading'));
	try {
		const res = await csrfFetch('/api/users/current');
		if (res.ok) {
			const user = await res.json();
			dispatch(loadUser(user));
			dispatch(setStatus('succeeded'));
		} else {
			const errors = await res.json();
			dispatch(setError(errors));
			dispatch(setStatus('failed'));
		}
	} catch (error) {
		dispatch(setError(error.message));
		dispatch(setStatus('failed'));
	}
};

export const fetchUserEvents = () => async (dispatch) => {
	dispatch(setStatus('loading'));
	try {
		const res = await csrfFetch('/api/profile/events');
		if (res.ok) {
			const events = await res.json();
			dispatch(loadUserEvents(events.events));
			dispatch(setStatus('succeeded'));
		} else {
			const errors = await res.json();
			dispatch(setError(errors));
			dispatch(setStatus('failed'));
		}
	} catch (error) {
		dispatch(setError(error.message));
		dispatch(setStatus('failed'));
	}
};

export const fetchUserBadges = () => async (dispatch) => {
	dispatch(setStatus('loading'));
	try {
		const res = await csrfFetch('/api/profile/badges');
		if (res.ok) {
			const badges = await res.json();
			dispatch(loadUserBadges(badges.badges));
			dispatch(setStatus('succeeded'));
		} else {
			const errors = await res.json();
			dispatch(setError(errors));
			dispatch(setStatus('failed'));
		}
	} catch (error) {
		dispatch(setError(error.message));
		dispatch(setStatus('failed'));
	}
};

export const fetchUserInvites = () => async (dispatch) => {
	dispatch(setStatus('loading'));
	try {
		const res = await csrfFetch('/api/invites');
		if (res.ok) {
			const invites = await res.json();
			dispatch(loadUserInvites(invites.invites));
			dispatch(setStatus('succeeded'));
		} else {
			const errors = await res.json();
			dispatch(setError(errors));
			dispatch(setStatus('failed'));
		}
	} catch (error) {
		dispatch(setError(error.message));
		dispatch(setStatus('failed'));
	}
};

export const fetchUserGroups = () => async (dispatch) => {
	dispatch(setStatus('loading'));
	try {
		const res = await csrfFetch('/api/groups');
		if (res.ok) {
			const groups = await res.json();
			dispatch(loadUserGroups(groups.groups));
			dispatch(setStatus('succeeded'));
		} else {
			const errors = await res.json();
			dispatch(setError(errors));
			dispatch(setStatus('failed'));
		}
	} catch (error) {
		dispatch(setError(error.message));
		dispatch(setStatus('failed'));
	}
};

export const fetchUserFriends = () => async (dispatch) => {
	dispatch(setStatus('loading'));
	try {
		console.log('Fetching friends...'); // Debug log
		const res = await csrfFetch('/api/friends/', {
			method: 'GET',
			credentials: 'include',
		});
		if (res.ok) {
			const data = await res.json();
			console.log('Fetched friends:', data.friends); // Log the friends array
			dispatch(loadUserFriends(data.friends));
			dispatch(setStatus('succeeded'));
		} else {
			const errors = await res.json();
			console.error('Fetch failed:', errors);
			dispatch(setError(errors));
			dispatch(setStatus('failed'));
		}
	} catch (error) {
		console.error('Error fetching friends:', error);
		dispatch(setError(error.message));
		dispatch(setStatus('failed'));
	}
};

// Reducer
const initialState = {
	profile: null,
	events: [],
	badges: [],
	invites: [],
	groups: [],
	friends: [],
	status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
	error: null, // Stores error messages
};

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case LOAD_USER:
			return { ...state, profile: action.user };
		case LOAD_USER_EVENTS:
			return { ...state, events: action.events };
		case LOAD_USER_BADGES:
			return { ...state, badges: action.badges };
		case LOAD_USER_INVITES:
			return { ...state, invites: action.invites };
		case LOAD_USER_GROUPS:
			return { ...state, groups: action.groups };
		case LOAD_USER_FRIENDS:
			console.log('Loaded friends:', action.friends); // Should print the array
			return { ...state, friends: action.friends };
		case SET_STATUS:
			return { ...state, status: action.status };
		case SET_ERROR:
			return { ...state, error: action.error };
		default:
			return state;
	}
};

export default userReducer;
