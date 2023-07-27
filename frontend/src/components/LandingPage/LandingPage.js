import React, { useEffect } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { fetchSpots } from '../../store/spots/spotActions';
import SpotTile from '../SpotTile/SpotTile';
import './LandingPage.css'

function LandingPage() {
    const dispatch = useDispatch();
    const spotSelector = (state) => {
        return state.spots
    }
    const spotList = useSelector(spotSelector)

    const spots = Object.values(spotList)

    useEffect(() => {
        dispatch(fetchSpots());
    }, [dispatch])

    return (
    <div>
        <div className='spot-tile-list'>
        {spots?.map(( spot ) => {
            return <SpotTile spot={spot} key={spot.id}/>
        })}
        </div>
    </div>
    )
}


export default LandingPage;
