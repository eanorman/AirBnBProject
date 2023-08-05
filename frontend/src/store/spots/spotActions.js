import { csrfSpotFetch } from "../csrfSpot";

export const FETCH_SPOTS_SUCCESS = 'FETCH_SPOTS_SUCCESS';
export const CREATE_SPOT_SUCCESS = 'CREATE_SPOT_SUCCESS';
export const FETCH_CURRENT_SPOTS = 'FETCH CURRENT_SPOTS';
export const DELETE_SPOT_SUCCESS = 'DELETE_SPOT_SUCCESS';
export const CLEAR_SPOT_SUCCESS = 'CLEAR_SPOT_SUCCESS';

export const fetchSpots = () => async (dispatch) => {
    const res = await fetch(`/api/spots`);
    if(res.ok){
        const data = await res.json();
        dispatch(receiveSpots(data));
        return data;
    } else {
        throw res;
    }
}

export const clearCurrentSpots = () => async(dispatch) => {
    dispatch(clearSpots());
    return;
}

const clearSpots = () => {
    return {
        type: CLEAR_SPOT_SUCCESS
    }
}
const receiveSpots = (spots) => {
    return {
        type: FETCH_SPOTS_SUCCESS,
        payload: spots
    }
}

export const fetchCurrentSpots = () => async (dispatch) => {
    const res = await csrfSpotFetch(`/api/spots/current`);
        const data = await res;
        dispatch(receiveCurrentSpots(data));
        return data
}

const receiveCurrentSpots = (spots) => {
    return {
        type: FETCH_CURRENT_SPOTS,
        payload: spots
    }
}

export const deleteSpot = (spotId) => async (dispatch) => {
    const res = await csrfSpotFetch(`/api/spots/${spotId}`, {
        method: 'DELETE'
    })
    const data = await res;
    dispatch(deletedSpot(spotId));

    return data;
}

const deletedSpot = (data) => {
    return {
        type: DELETE_SPOT_SUCCESS,
        payload: data
    }
}


const initialState = {};

const spotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SPOTS_SUCCESS: {
            const newState = {...state};
            action.payload.Spots.forEach((spot) => newState[spot.id] = spot);
            return newState;
        }
        case FETCH_CURRENT_SPOTS: {
            const newState = {...action.payload.Spots}
            return newState;
        }
        case DELETE_SPOT_SUCCESS: {
            const newState = {...state};
            return newState;
        }
        case CLEAR_SPOT_SUCCESS: {
            const newState = {}
            return newState;
        }
        default:
            return state;
    }
}

export default spotsReducer;
