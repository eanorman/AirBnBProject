import React from "react";
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteSpot } from "../../store/spots/spotActions";
import { fetchCurrentSpots } from "../../store/spots/spotActions";
import './RemoveSpotModal.css';

function RemoveSpotModal({ spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();




  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(deleteSpot(spotId))
    .then((res) => {
        closeModal();
        dispatch(fetchCurrentSpots());
        return res;
    })
  }

  return (
    <div className="remove-spot-container">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to remove this spot from the listings?</p>
        <button className="confirm" onClick={handleSubmit}>Yes (Delete Spot)</button>
        <button className="deny" onClick={closeModal}>No (Keep spot)</button>
    </div>
  )
}

export default RemoveSpotModal
