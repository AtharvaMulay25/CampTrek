if(process.env.NODE_ENV !== 'production')
{
    require('dotenv').config()  //this would add environment vars to process.env
}
const Campground = require("../models/campground");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding")
const mapBoxToken=process.env.MAPBOX_TOKEN;
const geocoder=mbxGeocoding({accessToken:mapBoxToken})
const {cloudinary} = require('../cloudinary');


module.exports.index = async(req, res)=>
{
    const campgrounds = await Campground.find();
    // console.log(campgrounds);
    res.render('campgrounds/index', {campgrounds});
    // res.render('home');
}

module.exports.renderNewForm = (req, res)=>
{
    // if(!req.isAuthenticated()){
    //     req.flash('error','You must be logged in to create a campground')
    //     return res.redirect('/login')
    // }
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req, res)=>
{
    const geoData = await geocoder.forwardGeocode({
        query:req.body.campground.location,
        limit:1
    }).send()
    print_data=JSON.parse(geoData.rawBody)
    console.log(print_data.features[0].geometry);
    //res.send("OK!!!");
    console.log("****************************")
    console.log(req.files);
    console.log("****************************")
    const campground = new Campground(req.body.campground);
    campground.geometry=print_data.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success','Successfully created new campground')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async(req, res)=>
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
}

module.exports.renderEditForm = async(req, res)=>
{
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error',"Campground doesn't exist")
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground});
}

module.exports.updateCampground = async(req, res)=>
{
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    const newImages = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(...newImages)
    await campground.save();

    if(req.body.deleteImages)
    {

        //deleting files from cloudinary
        for(let filename of req.body.deleteImages)
        {
            await cloudinary.uploader.destroy(filename)
        }

        //deleting images from mongodb
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async(req, res)=>
{
    const {id} = req.params;
    //this will also delete its associated all reviews
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground')
    res.redirect('/campgrounds');
}