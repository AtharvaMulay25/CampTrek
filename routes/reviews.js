const express=require('express');
const router=express.Router({mergeParams:true})//merge params is needed to get the parameters from the path in app.js
const catchAsync = require("../utilities/catchAsync")
const ExpressError = require("../utilities/ExpressError");
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const reviews = require('../controllers/reviews')


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))


module.exports = router;    