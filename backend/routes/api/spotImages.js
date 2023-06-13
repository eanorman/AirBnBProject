const express = require('express');
const bcrypt = require('bcryptjs');
const { requireAuth, spotImageOwner, spotImageExists } = require('../../utils/auth');
const { SpotImage } = require('../../db/models');

const router = express.Router();

//Delete a spotImage by imageId
router.delete('/:imageId', requireAuth, spotImageExists, spotImageOwner, async (req, res) => {
    const { imageId } = req.params;

    await SpotImage.destroy({
        where: {
            id: imageId
        }
    });
    res.json({
        message: "Successfully deleted"
    })
})

module.exports = router;
