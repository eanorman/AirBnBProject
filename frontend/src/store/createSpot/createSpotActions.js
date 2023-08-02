const CREATE_SPOT = 'createSpot';

const createSpot = (spot) => {
    return {
        type: CREATE_SPOT,
        payload: spot
    }
}

export const newSpot = (spot) => async (dispatch) => {
    const {country, 
           address, 
           city, 
           state, 
           lat, 
           lng,
           description,
           name,
           price} = spot;

    const response = await fetch('/api/spots', {
        method: "POST",
        body: JSON.stringify({
            country,
            address,
            city,
            state,
            lat,
            lng,
            description,
            name,
            price
        }),
    });
    const data = await response.json();
    dispatch(createSpot(data.spot));
    return response;
}

const initialState = {};

const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type){
        case CREATE_SPOT:
            newState = {...state};
            newState.createdSpot = action.payload;
            return newState;
        default:
            return state;
    }
}

export default spotReducer;