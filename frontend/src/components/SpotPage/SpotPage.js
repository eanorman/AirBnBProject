import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchIndSpot } from "../../store/spot/specSpotActions";
import './SpotPage.css';

function SpotPage() {
  let { spotId } = useParams();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchIndSpot(spotId)).then(() => setIsLoading(true));
  }, [dispatch, spotId]);

  const spotSelector = (state) => {
    return state.indSpot;
  };

  const spot = useSelector(spotSelector);

  if (isLoading) {
    return (
      <div className="spot-page">
        {spot.indSpot.SpotImages.map((image) => {
        return <img src={image.url} key={image.id} alt='spot'/>;
        })}
      </div>
    );
  }
}

export default SpotPage;
