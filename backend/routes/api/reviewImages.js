const express = require('express');
const { requireAuth, reviewImageExists, reviewImageAuth } = require('../../utils/auth');
const {ReviewImage } = require('../../db/models');



const router = express.Router();

//Delete a review image by id
router.delete('/:imageId', requireAuth, reviewImageExists, reviewImageAuth, async (req, res) => {
    let { imageId } = req.params;

    await ReviewImage.destroy({
        where:{
            id: imageId
        }
    })

    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;
