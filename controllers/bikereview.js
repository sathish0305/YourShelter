const Bike = require('../models/bike');
const BikeReview = require('../models/bikereview');

module.exports.createBikeReview = async (req, res) => {
    const bike = await Bike.findById(req.params.id);
    const bikereview = new BikeReview(req.body.bikereview);
    bikereview.author = req.user._id;
    bike.reviews.push(bikereview);
    await bikereview.save();
    await bike.save();
    req.flash('success', 'Created a new review!!');
    res.redirect(`/bikes/${bike._id}`);
}

module.exports.deleteBikeReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Bike.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await BikeReview.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully Deleted a review!!');
    res.redirect(`/bikes/${id}`);
}