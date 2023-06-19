const Campground = require("../models/campground");
const Review = require("../models/review");



module.exports.createReview = async(req, res)=>
{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    req.flash('success','Created new review!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteReview = async(req, res)=>
{
    // console.log("delete me");
    const {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    //delete the review from the corresponding campground too
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: {reviewId}}});
    req.flash('success','Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
}