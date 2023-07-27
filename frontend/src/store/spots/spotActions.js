export const FETCH_SPOTS_SUCCESS = 'FETCH_SPOTS_SUCCESS';

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

const receiveSpots = (spots) => {
    return {
        type: FETCH_SPOTS_SUCCESS,
        payload: spots
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
        default:
            return state;
    }
}

export default spotsReducer;
