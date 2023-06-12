const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema(
    {
        title: String,
        image: String,
        price: Number,
        description: String,
        location: String,
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