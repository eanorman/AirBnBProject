import React from 'react';
import './NewSpot.css';
import { useHistory } from 'react-router-dom';


function NewSpot() {
    const history = useHistory();
    const handleClick = () =>{
        history.push('/spots/new')
    }
    return (
        <div className='new-spot-container'>
            <button onClick={handleClick}>Create a New Spot</button>
        </div>
    )
}

export default NewSpot;
