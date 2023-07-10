const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;
// https://res.cloudinary.com/douqbebwk/image/upload/w_300/v1600113904/YelpCamp/gxgle1ovzd2f3dgcpass.png
//we have to add w_300 part after upload in the above url stored in db

const ImageSchema = new Schema({
    url: String,    //storing path coming from req.files as url
    filename: String    //storing filename coming from req.files as filename
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300');
});
const CampgroundSchema = new Schema(
    {
        title: String,
        images: [ImageSchema],
        // image:String,
        price: Number,
        description: String,
        location: String,
        author:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        geometry:{
            type: {
                type:String,
                enum:['Point'],
                required:true
            },
            coordinates:{
                type:[Number],
                required:true
            }
        },
        reviews:[
            {
                type: Schema.Types.ObjectId,
                ref: 'Review'
            }
        ]
    }
)

//findByIdAndDelete will trigger this middleware and
//then will delete all the associated reviews with campground
CampgroundSchema.post('findOneAndDelete', async (camp)=>
{   
    //if some campground is deleted
    if(camp)
    {
        await Review.deleteMany(
            {
                _id:{$in: camp.reviews}
            }
        )
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);