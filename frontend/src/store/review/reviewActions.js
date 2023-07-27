export const FETCH_REVIEW_SUCCESS = 'FETCH_REVIEW_SUCCESS';

export const fetchReview = (spotId) => async (dispatch) => {
    const res = await fetch(`/api/spots/${spotId}/reviews`);
    if(res.ok){
        const data = await res.json();
        dispatch(receiveReview(data));
        return data;
    } else {
        throw res;
    }
}

const receiveReview = (data) => {
    return {
        type: FETCH_REVIEW_SUCCESS,
        payload: data
    }
}

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_REVIEW_SUCCESS: {
            const newState = {...state, review: action.payload}
            return newState;
        }
        default: {
            return state;
        }
    }
}

export default reviewReducer;