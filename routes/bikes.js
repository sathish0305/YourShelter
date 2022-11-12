const express = require('express');
const router = express.Router();
const bikes = require('../controllers/bikes');
const catchAsync = require('../utils/catchAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const { isLoggedIn, validateBike, isBikeAuthor } = require('../middleware');

router.route('/')
    .get(catchAsync(bikes.index))
    .post(isLoggedIn, upload.array('image'), validateBike, catchAsync(bikes.createBike));


router.get('/new', isLoggedIn, bikes.renderNewForm);

router.route('/:id')
    .get(catchAsync(bikes.showBike))
    .put(isLoggedIn, isBikeAuthor, upload.array('image'), validateBike, catchAsync(bikes.updateBike))
    .delete(isLoggedIn, isBikeAuthor, catchAsync(bikes.deleteBike));

router.get('/:id/edit', isLoggedIn, isBikeAuthor, catchAsync(bikes.renderEdit));

module.exports = router;