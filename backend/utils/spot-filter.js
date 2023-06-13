const validateQuery = async function(req, res, next){
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

    let errorResponse = {
        message: 'Bad Request',
        errors: {}
    }

 if(page && (isNaN(parseInt(page)) || page < 1)){
    errorResponse.errors.page = "Page must be greater than or equal to 1"
 }
 if(size && (isNaN(parseInt(size)) || size < 1)){
    errorResponse.errors.size = "Size must be greater than or equal to 1"
 }
 if(maxLat && isNaN(parseInt(maxLat))){
     errorResponse.errors.maxLat = "Maximum latitude is invalid"
 }
 if(minLat && isNaN(parseInt(minLat))){
    errorResponse.errors.minLat = "Minimum latitude is invalid"
}
if(minLng && isNaN(parseInt(minLng))){
    errorResponse.errors.minLng = "Minimum longitude is invalid"
}
if(maxLng && isNaN(parseInt(maxLng))){
    errorResponse.errors.maxLng = "Maximum longitude is invalid"
}
if(minPrice && isNaN(parseInt(minPrice)) || minPrice < 0){
    errorResponse.errors.minPrice = "Minimum price must be greater than or equal to 0"
}
if(maxPrice && isNaN(parseInt(maxPrice)) || maxPrice < 0){
    errorResponse.errors.maxPrice = "Maximum price must be greater than or equal to 0"
}

let errorSize = Object.keys(errorResponse.errors).length;

if(errorSize){
    res.statusCode = 400;
    return res.json(errorResponse)
}

return next ();

}




module.exports = {
    validateQuery
}
