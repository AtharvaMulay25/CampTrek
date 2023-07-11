//This file is self contained in the sense that it connects to mongoose and use campgrounds model
const mongoose = require('mongoose')
const Campground = require("../models/campground")
const cities = require('./cities')
const {descriptors, places} = require('./seedHelpers');

//use local development database
mongoose.connect('mongodb://127.0.0.1:27017/camp-trek',);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));   //checking for errors
db.once("open", () => {
    console.log("Database connected");      //successfully connected
});

const sample = array => array[Math.floor(Math.random() * array.length)];

//delete existing data and seed with new data
const seedDB = async ()=>
{
    //here deleting campgrounds don't delete associated reviews*************
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const price=Math.floor(Math.random() *30)+10;
        const camp = new Campground({
            author: "648f56687c85978fb86b8dd0", 
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description:"Nice init'",
            geometry:{
                type:'Point',
                coordinates:[cities[random1000].longitude,cities[random1000].latitude]
            },
            price: price, 
            images: [
                {
                    url: 'https://res.cloudinary.com/dgwdskv8t/image/upload/v1687244977/CampTrek/epmgnscvrdmgiihqeoby.jpg',
                    filename: 'CampTrek/epmgnscvrdmgiihqeoby',
                    
                  },
                  {
                    url: 'https://res.cloudinary.com/dgwdskv8t/image/upload/v1687245017/CampTrek/jmczix483s7mpqvbcqoa.jpg',
                    filename: 'CampTrek/jmczix483s7mpqvbcqoa',
                  },
            ]
        })
        await camp.save();
    }
}

//closing the database if data is seeded successfully
seedDB().then(()=>
{
    mongoose.connection.close();
});