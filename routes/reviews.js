const express = require('express');
const router = express.Router({mergeParams: true});

const Shelter = require('../models/shelter');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas.js')


const validateReview = (req, res, next) => {
    const { error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
    
}

router.post('/',validateReview, catchAsync(async (req, res) => {
    const shelter = await Shelter.findById(req.params.id);
    const review = new Review(req.body.review);
    shelter.reviews.push(review);
    await review.save();
    await shelter.save();
    req.flash('success','Created a new review!!');
    res.redirect(`/shelters/${shelter._id}`);
 }));
 
 router.delete('/:reviewId', catchAsync(async(req,res) => {
     const { id, reviewId } = req.params;
     await Shelter.findByIdAndUpdate(id, {$pull: { reviews: reviewId}})
     await Review.findByIdAndDelete(reviewId);
     req.flash('success','Successfully Deleted a review!!');
     res.redirect(`/shelters/${id}`);
 }))

 module.exports = router;