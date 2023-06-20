const express=require('express');
const router=express.Router()
const catchAsync = require("../utilities/catchAsync")
const {isLoggedIn, validateCampground, isAuthor}=require("../middleware")
const campgrounds = require('../controllers/campgrounds')
const {storage} = require('../cloudinary')
//using multer middleware to parse multipart form data
const multer= require('multer')
const upload = multer({storage})






router.get('/', catchAsync(campgrounds.index))

router.get('/new', isLoggedIn, campgrounds.renderNewForm)


//here, we are uploading image first before validateCampground, since validateCampground need req.body which multer will give on uploading
router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))


router.get('/:id', catchAsync(campgrounds.showCampground))

router.get('/:id/edit',isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground)) 

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

module.exports = router