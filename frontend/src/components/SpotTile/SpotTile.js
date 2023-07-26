import React from 'react';


function SpotTile({spot}) {


    return (
    <div>
        <p key={spot.id}>{spot.name}</p>
    </div>
    )
}


export default SpotTile;
