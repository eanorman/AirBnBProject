import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchIndSpot } from "../../store/spot/specSpotActions";
import Reviews from "../Reviews/Reviews";
import './SpotPage.css';

function SpotPage() {
  let { spotId } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    dispatch(fetchIndSpot(spotId)).then(() => {
      // Check if the component is still mounted before updating the state
      if (isMounted) {
        setIsLoading(true);
      }
    });
    return () => {
      // This function will run when the component unmounts (user navigates away from the page)
      isMounted = false;
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
    console.log(spot.indSpot)
    return (
      <div className="spot-page-container">
        <div className="spot-page">
          <h1>{spot.indSpot.name}</h1>
          <h2>{spot.indSpot.city}, {spot.indSpot.state}, {spot.indSpot.country}</h2>
          <ul className="photo-gallery">
            {spot.indSpot.SpotImages.map((image, index) => {
              return (
                <i className={`photo-${index}`} key={image.id}>
                  <img src={image.url} key={image.id} alt={`spot ${image.id}`} />
                </i>
              )
            })}
          </ul>
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
                ) :(
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
              <Reviews spot={spot.indSpot}/>
        </div>
        </div>
      </div>
    );
  }
}

export default SpotPage;
