import React, { useEffect } from "react";
import './ManageSpots.css';
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentSpots } from "../../store/spots/spotActions";
import SpotTile from "../SpotTile/SpotTile";
import { useHistory } from "react-router-dom";
import OpenModalMenuItem from "../Navigation/OpenModalMenuItem";
import RemoveSpotModal from "../RemoveSpotModal/RemoveSpotModal";
import { clearCurrentSpots } from "../../store/spots/spotActions";

function ManageSpots() {
    const dispatch = useDispatch();
    const history = useHistory();
    const spotSelector = (state) => {
        return state.spots
    }
    const spotList = useSelector(spotSelector);
    const spots = Object.values(spotList)

    useEffect(() => {
        dispatch(fetchCurrentSpots())

        return () => {
            dispatch(clearCurrentSpots())
        }
    }, [dispatch])

    const handleClick = () =>{
        history.push('/spots/new')
    }

    const handleEdit = (spotId) => {
        history.push(`/spots/${spotId}/edit`)
    }


    return (
        <div className="manage-spots">
            <h2>Manage Your Spots</h2>
            <button onClick={handleClick} className="create-button">Create a New Spot</button>
            <div className='spot-tile-list'>
        {spots?.map(( spot ) => {
            return (
                <div className="spot-tile" key={spot.id}>
            <SpotTile spot={spot} key={spot.id}/>
            <div className="spacer">
            <button onClick={() => handleEdit(spot.id)} className="update-button">Update</button>
            <div className="delete-button">
            <OpenModalMenuItem className="delete-button" itemText="Delete" modalComponent={<RemoveSpotModal spotId={spot.id} />} />
           </div>
           </div>
            </div>
            )
        })}
        </div>
        </div>
    )
}

export default ManageSpots;
