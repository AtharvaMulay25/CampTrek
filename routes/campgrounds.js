const express=require('express');
const router=express.Router()
const catchAsync = require("../utilities/catchAsync")
const ExpressError = require("../utilities/ExpressError");
const Campground = require("../models/campground");
const {campgroundSchema} = require("../schemas");
const {isLoggedIn}=require("../middleware")


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


router.get('/', catchAsync(async(req, res)=>
{
    const campgrounds = await Campground.find();
    // console.log(campgrounds);
    res.render('campgrounds/index', {campgrounds});
    // res.render('home');
}))

router.get('/new', isLoggedIn,(req, res)=>
{
    // if(!req.isAuthenticated()){
    //     req.flash('error','You must be logged in to create a campground')
    //     return res.redirect('/login')
    // }
    res.render('campgrounds/new');
})

router.post('/', isLoggedIn,validateCampground, catchAsync(async(req, res)=>
{
    
    // if(!req.body.campground)
    // {
    //     throw new ExpressError("Invalid Campground data", 400); //bad request
    // }
    
    console.log(req.body);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success','Successfully created new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync(async(req, res)=>
{
    const campground = await Campground.findById(req.params.id).populate('reviews');    //populating reviews field while showing
    console.log(campground);
    if(!campground){
        req.flash('error',"Campground doesn't exist")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
    //res.render('campgrounds/show', {campground,msg:req.flash('success')});//this msg is the flash, or we can set up a middleware
}))

router.get('/:id/edit',isLoggedIn, catchAsync(async(req, res)=>
{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error',"Campground doesn't exist")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}))

router.put('/:id', isLoggedIn,validateCampground, catchAsync(async(req, res)=>
{
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
})) 

router.delete('/:id',isLoggedIn, catchAsync(async(req, res)=>
{
    const {id} = req.params;
    //this will also delete its all reviews
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground')
    res.redirect('/campgrounds');
}))

module.exports =router