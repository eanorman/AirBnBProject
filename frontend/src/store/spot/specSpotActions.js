export const FETCH_IND_SPOT_SUCCESS = 'FETCH_IND_SPOT_SUCCESS';

export const fetchIndSpot = (spotId) => async (dispatch) => {
    if(spotId !== 'new'){
        const res = await fetch(`/api/spots/${spotId}`);
        if(res.ok){
            const data = await res.json();
            dispatch(receiveIndSpot(data));
            return data;
        } else {
            throw res;
        }
    }
};

const receiveIndSpot = (spot) => {
    return {
        type: FETCH_IND_SPOT_SUCCESS,
        payload: spot
    }
};

const initialState = {};

const indSpotReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_IND_SPOT_SUCCESS: {
            const newState = {...state}
            newState.indSpot = action.payload;
            return newState
        }
        default: {
            return state;
        }
    }
}

export default indSpotReducer;
