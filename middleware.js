const { shelterSchema, reviewSchema, bikeSchema, bikereviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressError');
const Shelter = require('./models/shelter');
const Review = require('./models/review');
const Bike = require('./models/bike');
const BikeReview = require('./models/bikereview');



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateShelter = (req, res, next) => {
    const { error } = shelterSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const shelter = await Shelter.findById(id);
    if (!shelter.author.equals(req.user._id)) {
        req.flash('error', 'You do not have Permission!!!');
        return res.redirect(`/shelters/${id}`);
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have Permission!!!');
        return res.redirect(`/shelters/${id}`);
    }
    next();
}

//bikes middleware


module.exports.validateBike = (req, res, next) => {
    const { error } = bikeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

module.exports.isBikeAuthor = async (req, res, next) => {
    const { id } = req.params;
    const bike = await Bike.findById(id);
    if (!bike.author.equals(req.user._id)) {
        req.flash('error', 'You do not have Permission!!!');
        return res.redirect(`/bikes/${id}`);
    }
    next();
}

module.exports.validateBikeReview = (req, res, next) => {
    const { error } = bikereviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }

}

module.exports.isBikeReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const bikereview = await BikeReview.findById(reviewId);
    if (!bikereview.author.equals(req.user._id)) {
        req.flash('error', 'You do not have Permission!!!');
        return res.redirect(`/bikes/${id}`);
    }
    next();
}