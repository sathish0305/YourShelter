const express = require('express');
const router = express.Router({ mergeParams: true });
const bikereviews = require('../controllers/bikereview');
const { validateBikeReview, isLoggedIn, isBikeReviewAuthor } = require('../middleware');

const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateBikeReview, catchAsync(bikereviews.createBikeReview));

router.delete('/:reviewId', isLoggedIn, isBikeReviewAuthor, catchAsync(bikereviews.deleteBikeReview))

module.exports = router;