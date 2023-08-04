import { csrfSpotFetch } from "../csrfSpot";

export const FETCH_REVIEW_SUCCESS = 'FETCH_REVIEW_SUCCESS';
export const CREATE_REVIEW_SUCCESS = 'CREATE_REVIEW_SUCCESS';
export const DELETE_REVIEW_SUCCESS = 'DELETE_REVIEW_SUCCESS';

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

export const createReview = (spotId, review, stars) => async (dispatch) => {
    const res = await csrfSpotFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
            review,
            stars
        }),
    });
        const data = await res;
        dispatch(createdReview(data))
        return data;

}

export const deleteReview = (reviewId) => async (dispatch) => {
    const res = await csrfSpotFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    });

      const data = await res
      dispatch(deletedReview(reviewId));
      return data;

  };

const receiveReview = (data) => {
    return {
        type: FETCH_REVIEW_SUCCESS,
        payload: data
    }
}

const createdReview = (data) => {
    return {
        type: CREATE_REVIEW_SUCCESS,
        payload: data
    }
}

const deletedReview = (data) => {
    return{
        type: DELETE_REVIEW_SUCCESS,
        payload: data
    }
}

const initialState = {};

const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
      case FETCH_REVIEW_SUCCESS: {
        const newState = { ...state, review: action.payload };
        return newState;
      }
      case CREATE_REVIEW_SUCCESS: {
        const newState = { ...state, review: action.payload };
        return newState;
      }
      case DELETE_REVIEW_SUCCESS: {
        const updatedReviews = state.review?.Reviews.filter(
          (review) => review.id !== action.payload
        );

        const newState = {
          ...state,
          review: {
            ...state.review,
            Reviews: updatedReviews,
          },
        };
        return newState;
      }
      default: {
        return state;
      }
    }
  };

  export default reviewReducer;
