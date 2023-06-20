const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


//associating cloudinary account with cloudinary instance
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

//creating storage instance
const storage = new CloudinaryStorage({
    cloudinary, 
    params:
    {
        folder: 'CampTrek',
        allowedFormats : ['png', 'jpeg', 'jpg']
    }    
});

module.exports = {cloudinary, storage}