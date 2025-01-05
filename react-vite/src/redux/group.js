import { csrfFetch } from './csrf';

// Action Types
const SET_GROUP = 'group/setGroup';
const REMOVE_GROUP = 'group/removeGroup';

// Action Creators
const setGroup = (group) => ({
	type: SET_GROUP,
	payload: group,
});

const removeGroup = () => ({
	type: REMOVE_GROUP,
});

// Thunk: Fetch a single group
export const thunkFetchGroup = (groupId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/groups/${groupId}`);
		if (response.ok) {
			const group = await response.json();
			dispatch(setGroup(group));
		} else {
			throw new Error('Failed to fetch group');
		}
	} catch (error) {
		console.error('Error fetching group:', error);
	}
};

// Thunk: Create a new group
export const thunkCreateGroup = (groupData) => async (dispatch) => {
	try {
		const response = await csrfFetch('/api/groups/', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(groupData),
		});
		if (response.ok) {
			const newGroup = await response.json();
			dispatch(setGroup(newGroup));
			return newGroup; // Return created group if needed
		} else {
			throw new Error('Failed to create group');
		}
	} catch (error) {
		console.error('Error creating group:', error);
		return { error: error.message };
	}
};

// Thunk: Update an existing group
export const thunkUpdateGroup = (groupData) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/groups/${groupData.groupId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(groupData),
		});
		if (response.ok) {
			const updatedGroup = await response.json();
			dispatch(setGroup(updatedGroup));
			return updatedGroup; // Return updated group if needed
		} else {
			throw new Error('Failed to update group');
		}
	} catch (error) {
		console.error('Error updating group:', error);
		return { error: error.message };
	}
};

// Thunk: Delete a group
export const thunkDeleteGroup = (groupId) => async (dispatch) => {
	try {
		const response = await csrfFetch(`/api/groups/${groupId}`, {
			method: 'DELETE',
		});
		if (response.ok) {
			dispatch(removeGroup());
			return { success: true };
		} else {
			throw new Error('Failed to delete group');
		}
	} catch (error) {
		console.error('Error deleting group:', error);
		return { error: error.message };
	}
};

// Initial State
const initialState = { group: null };

// Reducer
function groupReducer(state = initialState, action) {
	switch (action.type) {
		case SET_GROUP:
			return { ...state, group: action.payload };
		case REMOVE_GROUP:
			return { ...state, group: null };
		default:
			return state;
	}
}

export default groupReducer;
