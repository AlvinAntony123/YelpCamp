const Campground = require('../models/campground');
const Review = require('../models/reviews')

module.exports.createReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const camp = await Campground.findById(id);
        const review = new Review(req.body);
        review.author = req.user._id;
        camp.reviews.push(review);
        await review.save();
        await camp.save();
        req.flash('success', 'Successfully Added A Review');
        res.redirect(`/campgrounds/${id}`)
    } catch (e) {
        next(e);
    }
}

module.exports.deleteReview = async (req, res, next) => {
    try {
        const { id, reviewId } = req.params;
        await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);
        req.flash('success', 'Successfully Deleted A Review');
        res.redirect(`/campgrounds/${id}`);
    } catch (e) {
        next(e);
    }
}