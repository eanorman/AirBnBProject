import Cookies from "js-cookie";
import { csrfSpotFetch } from "../csrfSpot";

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

export const createSpot = (spot) => async (dispatch) => {
    const {
        country,
        address,
        city,
        state,
        lat,
        lng,
        description,
        name,
        price,
        imageUrls
    } = spot;
    const response = await csrfSpotFetch("/api/spots", {
        method: "POST",
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }),
    });
    const data = await response;
    console.log(data)
    dispatch(receiveIndSpot(data))
    return response;

}

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
