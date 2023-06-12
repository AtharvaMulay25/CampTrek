const express=require('express');
const router=express.Router({mergeParams:true})//merge params is needed to get the parameters from the path in app.js
const catchAsync = require("../utilities/catchAsync")
const ExpressError = require("../utilities/ExpressError");
const Review = require("../models/review");
const Campground = require("../models/campground");
const {reviewSchema} = require("../schemas");

//middleware for validating review model using reviewSchema
const validateReview = (req, res, next)=>
{
    const {error} = reviewSchema.validate(req.body);
    if(error)
    {
        const msg = error.details.map(e=>e.message).join(",");
        throw new ExpressError(msg, 400);
    }
    else
    {
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res)=>
{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success','Created new review')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', catchAsync(async(req, res)=>
{
    // console.log("delete me");
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    //delete the review from the corresponding campground too
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: {reviewId}}});
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}))
module.exports = router;