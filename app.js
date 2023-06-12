const express  = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const path = require('path')
const Campground = require("./models/campground");
const Review = require('./models/review');
const {campgroundSchema, reviewSchema} = require("./schemas");
const ejsMate = require('ejs-mate')
const catchAsync = require("./utilities/catchAsync")
const ExpressError = require("./utilities/ExpressError");


//use local development database
mongoose.connect('mongodb://localhost:27017/camp-trek').then(()=>
{
    console.log("Connection Established!");
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));   //checking for errors
db.once("open", () => {
    console.log("Database connected");      //successfully connected
});


//executing express
const app = express()

//setting ejs for templating 
app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//setting middleware to parse form data
app.use(express.urlencoded({extended:true}));

//overriding the method sent by form
app.use(methodOverride('_method'));


//middleware for validating campground model using campgroundSchema
const validateCampground = (req, res, next)=>
{
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

// set up all the routes
app.get('/', (req, res)=>
{
    res.render('home');
})

app.get('/campgrounds', catchAsync(async(req, res)=>
{
    const campgrounds = await Campground.find();
    // console.log(campgrounds);
    res.render('campgrounds/index', {campgrounds});
    // res.render('home');
}))

app.get('/campgrounds/new', (req, res)=>
{
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampground, catchAsync(async(req, res)=>
{
    // if(!req.body.campground)
    // {
    //     throw new ExpressError("Invalid Campground data", 400); //bad request
    // }
    
    console.log(req.body);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.get('/campgrounds/:id', catchAsync(async(req, res)=>
{
    const campground = await Campground.findById(req.params.id).populate('reviews');    //populating reviews field while showing
    console.log(campground);
    res.render('campgrounds/show', {campground});
}))

app.get('/campgrounds/:id/edit', catchAsync(async(req, res)=>
{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req, res)=>
{
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    res.redirect(`/campgrounds/${campground._id}`);
})) 

app.delete('/campgrounds/:id', catchAsync(async(req, res)=>
{
    const {id} = req.params;
    //this will also delete its all reviews
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req, res)=>
{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await campground.save();
    await review.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:campgroundId/reviews/:reviewId', catchAsync(async(req, res)=>
{
    // console.log("delete me");
    const {campgroundId, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);
    //delete the review from the corresponding campground too
    await Campground.findByIdAndUpdate(campgroundId, {$pull: {reviews: {reviewId}}});
    res.redirect(`/campgrounds/${campgroundId}`);
}))

app.all("*", (req, res, next)=>
{
    next(new ExpressError("Page Not Found!!", 404));
})

app.use((err, req, res, next)=>
{
    //set default values to status(internal sever error) and message
    const {statusCode = 500} = err;
    if(!err.message)
    {
        err.message = "Something went Wrong!!";
    }
    res.status(statusCode).render('error', {err});
    // res.send("Something went Wrong!!");
})

//Listening on port 3000
app.listen(3000, ()=>
{
    console.log("On port 3000!!");
})