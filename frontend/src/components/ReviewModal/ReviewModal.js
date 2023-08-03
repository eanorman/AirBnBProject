import React, { useState } from 'react';
import './ReviewModal.css';

function ReviewModal() {
  const [text, setText] = useState('');
  const [stars, setStars] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // return dispatch()
  };

  const handleClick = (num) => () => {
    setStars(num);
  };

  let disabled = true;
  if (text.length >= 10 && stars > 0) disabled = false;


    return (
      <div className='review-container'>
        <h1>How was your stay?</h1>
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
              <span onClick={() => handleClick(1)}>☆</span>
              <span onClick={() => handleClick(2)}>☆</span>
              <span onClick={() => handleClick(3)}>☆</span>
              <span onClick={() => handleClick(4)}>☆</span>
              <span onClick={() => handleClick(5)}>☆</span>
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
