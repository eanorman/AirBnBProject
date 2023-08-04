import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearIndSpot, fetchIndSpot } from "../../store/spot/specSpotActions";
import Reviews from "../Reviews/Reviews";
import './SpotPage.css';

function SpotPage() {
  let { spotId } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    dispatch(fetchIndSpot(spotId)).then(() => {
      if (isMounted) {
        setIsLoading(true);
      }
    });
    return () => {
      isMounted = false;
      setIsLoading(false);
      dispatch(clearIndSpot())
    };
  }, [dispatch, spotId]);

  const spotSelector = (state) => {
    return state.indSpot;
  };

  const spot = useSelector(spotSelector);
  const handleClick = () => {
    alert('Feature coming soon...')
  }

  if (isLoading) {
    return (
      <div className="spot-page-container">
        <div className="spot-page">
          <h1>{spot.indSpot.name}</h1>
          <h2>{spot.indSpot.city}, {spot.indSpot.state}, {spot.indSpot.country}</h2>
          <div className="photo-gallery">
            <div className="photo-0">
              <img src={spot.indSpot.SpotImages[0].url} alt={`spot ${spot.indSpot.SpotImages[0].id}`} />
            </div>
            <div className="spot-images-grid">
              {spot.indSpot.SpotImages.slice(1).map((image, index) => (
                <div key={image.id} className={`photo-item photo-${index + 1}`}>
                  <img src={image.url} alt={`spot ${image.id}`} />
                </div>
              ))}
            </div>
          </div>
          <div className="spot-container">
            <div className="spot-description">
              <h2>Hosted by {spot.indSpot.Owner.firstName} {spot.indSpot.Owner.lastName}</h2>
              <p>{spot.indSpot.description}</p>
            </div>
            <div className="spot-reserve">
              <div className="price-rating">
                <p className="price">${spot.indSpot.price} night</p>
                {spot.indSpot.numReviews > 0 ? (
                  spot.indSpot.numReviews === 1 ? (
                    <div>
                      <p className="rating">★{spot.indSpot.avgStarRating} • {spot.indSpot.numReviews} Review</p>
                    </div>
                  ) : (
                    <div>
                      <p className="rating">★{spot.indSpot.avgStarRating} • {spot.indSpot.numReviews} Reviews</p>
                    </div>
                  )
                ) : (
                  <p>★ New</p>
                )}
              </div>
              <div className="reserve-button">
                <button id='reserve' onClick={handleClick}>Reserve</button>
              </div>
            </div>
          </div>
          <div className="review-container">
            <Reviews spot={spot.indSpot} />
          </div>
        </div>
      </div>
    );
  }
}

export default SpotPage;
