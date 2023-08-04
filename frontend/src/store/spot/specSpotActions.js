import { csrfSpotFetch } from "../csrfSpot";

export const FETCH_IND_SPOT_SUCCESS = 'FETCH_IND_SPOT_SUCCESS';
export const CLEAR_IND_SPOT_SUCCESS = 'CLEAR_IND_SPOT_SUCCESS';

export const fetchIndSpot = (spotId) => async (dispatch) => {
    if (spotId !== 'new') {
        const res = await fetch(`/api/spots/${spotId}`);
        if (res.ok) {
            const data = await res.json();
            dispatch(receiveIndSpot(data));
            return data;
        } else {
            throw res;
        }
    }
};

export const clearIndSpot = () => async (dispatch) => {
    dispatch(clearSpot())
}

const clearSpot = () => {
    return {
        type: CLEAR_IND_SPOT_SUCCESS
    }
}

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
    const successfulImages = await handleImages(data.id, imageUrls);
    data.SpotImages = successfulImages;
    dispatch(receiveIndSpot(data))
    const updatedIndSpot = await dispatch(fetchIndSpot(data.id));
    return updatedIndSpot;

}

export const updateSpot = (spot) => async (dispatch) => {
    const {
        id,
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
    const response = await csrfSpotFetch(`/api/spots/${id}`, {
        method: "PUT",
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
    await deleteImages(data.id);
    const successfulImages = await handleImages(data.id, imageUrls);
    data.SpotImages = successfulImages;
    dispatch(receiveIndSpot(data))
    const updatedIndSpot = await dispatch(fetchIndSpot(data.id));
    return updatedIndSpot;

}

const deleteImages = async (spotId) => {
    const res = await fetch(`/api/spots/${spotId}`)
    if(res.ok){
        const data = await res.json();
        const spotImages = data.SpotImages
        const imageIds = spotImages.map(image => image.id)
        for (let i = 0; i < imageIds.length; i++) {
            let id = imageIds[i];
            const res = await csrfSpotFetch(`/api/spot-images/${id}`, {
                method: 'DELETE'
            })
            await res;
        }
    }

    return;
}

export const handleImages = async (spotId, images) => {
    let successfulImages = [];

    for (let i = 0; i < images.length; i++) {
        let url = images[i];
        let preview = false
        if (i === 0) preview = true;
        if(url.trim() !== '' && isValidImageUrl(url)){
            const response = await csrfSpotFetch(`/api/spots/${spotId}/images`, {
                method: "POST",
                body: JSON.stringify({
                    url,
                    preview
                })
            })

            const data = await response;
            successfulImages.push(data);

        }

    }
    return successfulImages;
}


const isValidImageUrl = (url) => {
    const supportedFormats = ['jpg', 'jpeg', 'png'];
    const extension = url.split('.').pop().toLowerCase();
    return supportedFormats.includes(extension);
}


const initialState = {};

const indSpotReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_IND_SPOT_SUCCESS: {
            const newState = { ...state }
            newState.indSpot = action.payload;
            return newState
        }
        case CLEAR_IND_SPOT_SUCCESS: {
            const newState = {}
            return newState;
        }
        default: {
            return state;
        }
    }
}

export default indSpotReducer;
