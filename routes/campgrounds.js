const express=require('express');
const router=express.Router()
const catchAsync = require("../utilities/catchAsync")
const {isLoggedIn, validateCampground, isAuthor}=require("../middleware")

const Campground = require("../models/campground");






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
    campground.author = req.user._id;
    await campground.save();
    req.flash('success','Successfully created new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.get('/:id', catchAsync(async(req, res)=>
{
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');    //populating reviews field while showing
    console.log(campground);
    if(!campground){
        req.flash('error',"Campground doesn't exist")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground});
    //res.render('campgrounds/show', {campground,msg:req.flash('success')});//this msg is the flash, or we can set up a middleware
}))

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(async(req, res)=>
{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error',"Campground doesn't exist")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}))

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async(req, res)=>
{
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
})) 

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(async(req, res)=>
{
    const {id} = req.params;
    //this will also delete its all reviews
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground')
    res.redirect('/campgrounds');
}))

module.exports = router