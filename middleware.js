const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require("./utilities/ExpressError");
const {campgroundSchema, reviewSchema} = require("./schemas");


//middleware to check if user is authenticated/logged in
module.exports.isLoggedIn=(req,res,next)=>{
    console.log("REQ.USER...",req.user)
    if(!req.isAuthenticated()){
        req.session.returnTo=req.originalUrl
        req.flash('error','You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}
module.exports.storeReturnTo=(req,res,next)=>{
    if(req.session.returnTo){
        res.locals.returnTo=req.session.returnTo;
    }
    next();
}

//middleware for validating if author is owner of campground
module.exports.isAuthor = async(req, res, next)=>
{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id))
    {
        req.flash('error', 'You are not premitted to do that!')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//middleware for validating if author is owner of review
module.exports.isReviewAuthor = async(req, res, next)=>
{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id))
    {
        req.flash('error', 'You are not premitted to do that!')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

//middleware for validating campground model using campgroundSchema
module.exports.validateCampground = (req, res, next)=>
{
    console.log(req.body)
    const {error} = campgroundSchema.validate(req.body);
    if(error)
    {
        console.log("IndsHereee");
        const msg = error.details.map(e=>e.message).join(",");
        console.log(msg);
        throw new ExpressError(msg, 400);
    }
    else
    {
        next();
    }
}


//middleware for validating review model using reviewSchema
module.exports.validateReview = (req, res, next)=>
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