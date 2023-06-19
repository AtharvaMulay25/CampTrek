const Campground = require("../models/campground");



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
    const campground = await Campground.findByIdAndUpdate(req.params.id, req.body.campground);
    req.flash('success','Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async(req, res)=>
{
    const {id} = req.params;
    //this will also delete its all reviews
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully deleted campground')
    res.redirect('/campgrounds');
}