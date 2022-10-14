const express = require('express');
const router = express.Router({mergeParams: true});
const {validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Shelter = require('../models/shelter');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');

router.post('/',isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const shelter = await Shelter.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    shelter.reviews.push(review);
    await review.save();
    await shelter.save();
    req.flash('success','Created a new review!!');
    res.redirect(`/shelters/${shelter._id}`);
 }));
 
 router.delete('/:reviewId',isLoggedIn,isReviewAuthor, catchAsync(async(req,res) => {
     const { id, reviewId } = req.params;
     await Shelter.findByIdAndUpdate(id, {$pull: { reviews: reviewId}})
     await Review.findByIdAndDelete(reviewId);
     req.flash('success','Successfully Deleted a review!!');
     res.redirect(`/shelters/${id}`);
 }))

 module.exports = router;