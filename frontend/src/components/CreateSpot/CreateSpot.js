import React from "react";
import "./CreateSpot.css";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { createSpot } from "../../store/spot/specSpotActions";
import { useDispatch } from "react-redux";

function CreateSpot() {
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrls, setImageUrls] = useState(["", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  const history = useHistory();

  const isValidImageUrl = (url) => {
    const supportedFormats = ["jpg", "jpeg", "png"];
    const extension = url.split(".").pop().toLowerCase();
    return supportedFormats.includes(extension);
  };

  const handleSubmit = (e) => {
    const areImageUrlsValid = imageUrls.every((url) => {
      const trimmedUrl = url.trim();
      return trimmedUrl === "" || isValidImageUrl(trimmedUrl);
    });

    e.preventDefault();
    if (!areImageUrlsValid) {
      setErrors({ imageUrls: "One or more image URLs are invalid" });
      return;
    }
    return dispatch(
      createSpot({
        country,
        address,
        city,
        state,
        lat,
        lng,
        description,
        name,
        price,
        imageUrls,
      })
    )
      .then((res) => {
        history.push(`/spots/${res.id}`);
      })
      .catch((res) => {
        const data = res;

        if (data && data.errors) {
          setErrors({
            ...errors,
            ...data.errors,
          });
        }
      });
  };

  const handleImageUrlChange = (index, value) => {
    const updatedImageUrls = [...imageUrls];
    updatedImageUrls.splice(index, 1, value);
    setImageUrls(updatedImageUrls);
  };

  return (
    <div className="create-container">
      <h1>Create a New Spot</h1>
      <h2>Where's your place located?</h2>
      <p>
        Guests will only get your exact address once they booked a reservation
      </p>

      <form>
        {errors.country && <p className="error">{errors.country}</p>}
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Country"
            required
          />
        </label>
        {errors.address && <p className="error">{errors.address}</p>}
        <label>
          Street address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            required
          />
        </label>
        <div className="city-state-container">
          {errors.city && <p className="error">{errors.city}</p>}
          <label className="city">
            City
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City"
              required
            />
          </label>
          <span className="comma"> , </span>
          {errors.state && <p className="error">{errors.state}</p>}
          <div className="state">
          <label>
            State
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              required
            />
          </label>
          </div>
        </div>
        {errors.lat && <p className="error">{errors.lat}</p>}
        <div className="lat-lng-container">
          <div className="lat">
            <label>
              Latitude
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                placeholder="Latitude"
                required
              />
            </label>
          </div>
          {errors.lng && <p className="error">{errors.lng}</p>}
          <div className="lng">
            <label>
              Longitude
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                placeholder="Longitude"
                required
              />
            </label>
          </div>
        </div>
        <div className="border"></div>
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amenities like
          fast wifi or parking, and what you love about the neighborhood.
        </p>
        {errors.description && <p className="error">{errors.description}</p>}
        <div className="description">
        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please write at least 30 characters"
            required
          />
        </label>
        </div>

        <div className="border"></div>
        <h2>Create a title for your spot</h2>
        <p>
          Catch guests' attention with a spot title that highlights what makes
          your place special.
        </p>
        {errors.name && <p className="error">{errors.name}</p>}
        <label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name of your spot"
            required
          />
        </label>
        <div className="border"></div>
        <h2>Set a base price for your spot</h2>
        <p>
          Competitive pricing can help your listing stand out and rank higher in
          search results.
        </p>
        {errors.price && <p className="error">{errors.price}</p>}
        <div className="create-price">
        <label>
          <span>$</span>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price per night (USD)"
          />
        </label>
        </div>
        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>
        {errors.imageUrls && <p className="error">{errors.imageUrls}</p>}
        <label>
          <input
            type="text"
            value={imageUrls[0]}
            onChange={(e) => handleImageUrlChange(0, e.target.value)}
            placeholder="Preview Image URL"
            required
          />
        </label>
        <label>
          <input
            type="text"
            value={imageUrls[1]}
            onChange={(e) => handleImageUrlChange(1, e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={imageUrls[2]}
            onChange={(e) => handleImageUrlChange(2, e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={imageUrls[3]}
            onChange={(e) => handleImageUrlChange(3, e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <label>
          <input
            type="text"
            value={imageUrls[4]}
            onChange={(e) => handleImageUrlChange(4, e.target.value)}
            placeholder="Image URL"
          />
        </label>
        <div className="border"></div>
        <div className="button">
        <button type="submit" onClick={handleSubmit}>
          Create Spot
        </button>
        </div>
      </form>
    </div>
  );
}

export default CreateSpot;
