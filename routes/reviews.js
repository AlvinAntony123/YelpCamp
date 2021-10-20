const express = require('express');
const router = express.Router({ mergeParams: true });
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/reviews');
const { reviewSchema } = require('../schema')
const { validateReview, isLoggedIn, isReviewOwner } = require('../middleware')
const review = require('../controllers/reviews')

router.post('/', validateReview, isLoggedIn, review.createReview);

router.delete('/:reviewId', isLoggedIn, isReviewOwner, review.deleteReview);

module.exports = router;