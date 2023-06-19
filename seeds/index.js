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
    for (let i = 0; i < 50; i++)
    {
        const random1000 = Math.floor(Math.random() * 1000);
        const price=Math.floor(Math.random() *30)+10;
        const camp = new Campground({
            author: "64904dbff2c4e5e270f2fe8c", 
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image:`https://source.unsplash.com/collection/483251`,
            description:"Nice init'",
            price: price
        })
        await camp.save();
    }
}

//closing the database if data is seeded successfully
seedDB().then(()=>
{
    mongoose.connection.close();
});