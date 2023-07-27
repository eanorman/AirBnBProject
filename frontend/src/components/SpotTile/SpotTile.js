import React from "react";
import "./SpotTile.css";
import { useHistory } from "react-router-dom";

function SpotTile({ spot }) {
  const history = useHistory();
  const handleClick = () => {
    let path = `/spots/${spot.id}`;
    history.push(path);
  };

  return (
    <div className="spot-tile" onClick={handleClick}>
      <span className="tooltip-text">{spot.name}</span>
      <img src={spot.previewImage} alt="Spot" />
      <div className="container">
        <p key={spot.id} className="spot-name">
          {spot.city}, {spot.state}
        </p>
        {spot.avgRating > 0 ? (
          <p className="rating">★{spot.avgRating}</p>
        ) : (
          <p>★ New</p>
        )}
        <p className="price">${spot.price} night</p>
      </div>
    </div>
  );
}

export default SpotTile;
