import React, { useState } from 'react';
import './ReviewModal.css';
import { createReview, fetchReview } from '../../store/review/reviewActions';
import { useModal } from '../../context/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchIndSpot } from '../../store/spot/specSpotActions';

function ReviewModal({setLoading, loading}) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const spotSelector = (state) => {
    return state.indSpot.indSpot.id;
  };

  const spot = useSelector(spotSelector);


  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createReview(spot, text, rating))
    .then((res) => {
      closeModal();
      dispatch(fetchReview(spot));
      dispatch(fetchIndSpot(spot));
      setLoading(false);
      console.log(loading)
      return res;
    })
    .catch((res) => {
      const data = res;
      if(data && data.errors) {
        setErrors(data.errors)
      }
    })
  };

  let disabled = true;
  if (text.length >= 10 && rating > 0) disabled = false;

  const setStarColor = (ratingValue) => {
    if (ratingValue <= (hover || rating)) {
      return 'yellow';
    } else {
      return 'gray';
    }
  };

  return (
    <div className='review-container'>
      <h1>How was your stay?</h1>
      {errors.message && <p>{errors.message}</p>}
      <form>
        <label>
          <textarea
            placeholder='Leave your review here...'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </label>
        <label>
          <div className='rating-stars'>
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <label key={ratingValue}>
                  <input
                    type='radio'
                    name='rating'
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}

                  />
                  <i 
                    className={`fa fa-star ${setStarColor(ratingValue)}`}                     
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(null)} ></i>
                </label>
              );
            })}
          </div>
          Stars
        </label>
      </form>
      <button type='submit' onClick={handleSubmit} disabled={disabled}>
        Submit Your Review
      </button>
    </div>
  );
}

export default ReviewModal;