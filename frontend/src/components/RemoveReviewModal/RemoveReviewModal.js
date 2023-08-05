import React from "react";
import { deleteReview, fetchReview } from "../../store/review/reviewActions";
import { useModal } from "../../context/Modal";
import { useDispatch, useSelector } from "react-redux";
import { fetchIndSpot } from "../../store/spot/specSpotActions";
import './RemoveReviewModal.css';

function RemoveReviewModal({ reviewId, setLoading }) {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const spotSelector = (state) => {
        return state.indSpot.indSpot.id;
    };

    const spot = useSelector(spotSelector);

    const handleSubmit = async (e) => {
        e.preventDefault();
         dispatch(deleteReview(reviewId))
         .then((res) =>{
             closeModal();
             dispatch(fetchReview(spot));
             dispatch(fetchIndSpot(spot));
             setLoading(false);
            return res;
         })
      };
    return (
        <div className="remove-review-container">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this review?</p>
            <button className='confirm' onClick={handleSubmit}>Yes (Delete Review)</button>
            <button className='deny' onClick={closeModal}>No (Keep Review)</button>
        </div>
    )
};

export default RemoveReviewModal;
