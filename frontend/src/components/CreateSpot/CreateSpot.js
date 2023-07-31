import React from "react";
import './CreateSpot.css'
import { useState } from "react";

function CreateSpot(){
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [lat, setLat] = useState('');
    const [lng, setLng] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [picOne, setPicOne] = useState('');
    const [picTwo, setPicTwo] = useState('');
    const [picThree, setPicThree] = useState('');
    const [picFour, setPicFour] = useState('');
    const [picFive, setPicFive] = useState('');


    return (
        <div>
            <h1>Create a New Spot</h1>
            <h2>Where's your place located?</h2>
            <p>Guests will only get your exact address once they booked a reservation</p>
            <form>
                <label>
                    Country
                    <input
                    type='text'
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="Country"
                    required
                    />
                </label>
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
                <label>
                    City
                    <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    required
                    />
                </label>
                <span> , </span>
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
                <h2>Describe your place to guests</h2>
                <p>Mention the best features of your space, any special
                    amenities like fast wifi or parking, and what you
                    love about the neighborhood.
                </p>
                <label>
                    Description
                    <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Please write at least 30 characters"
                    required
                    />
                </label>
                <h2>Create a title for your spot</h2>
                <p>Catch guests' attention with a spot title that highlights
                    what makes your place special.
                </p>
                <label>
                    <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name of your spot"
                    required
                    />
                </label>
                <h2>Set a base price for your spot</h2>
                <p>Competitive pricing can help your listing stand out and
                    rank higher in search results.
                </p>
                <label>
                    <p>$</p>
                    <input
                        type='number'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price per night (USD)"
                    />
                </label>
                <h2>Liven up your spot with photos</h2>
                <p>Submit a link to at least one photo to publish your spot.</p>
                <label>
                    <input
                    type="text"
                    value={picOne}
                    onChange={(e) => setPicOne(e.target.value)}
                    placeholder="Preview Image URL"
                    />
                </label>
                <label>
                    <input
                    type="text"
                    value={picTwo}
                    onChange={(e) => setPicTwo(e.target.value)}
                    placeholder="Image URL"
                    />
                </label>
                <label>
                    <input
                    type="text"
                    value={picThree}
                    onChange={(e) => setPicThree(e.target.value)}
                    placeholder="Image URL"
                    />
                </label>
                <label>
                    <input
                    type="text"
                    value={picFour}
                    onChange={(e) => setPicFour(e.target.value)}
                    placeholder="Image URL"
                    />
                </label>
                <label>
                    <input
                    type="text"
                    value={picFive}
                    onChange={(e) => setPicFive(e.target.value)}
                    placeholder="Image URL"
                    />
                </label>
                <button type="submit">Create Spot</button>
            </form>
        </div>
    )
}

export default CreateSpot;
