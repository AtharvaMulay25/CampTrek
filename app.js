const express  = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override');
const path = require('path')
const ejsMate = require('ejs-mate')
const session=require('express-session')
const flash=require('connect-flash')
const ExpressError = require("./utilities/ExpressError");

const campgrounds=require('./routes/campgrounds')
const reviews=require('./routes/reviews')
//use local development database
mongoose.connect('mongodb://127.0.0.1:27017/camp-trek').then(()=>
{
    console.log("Connection Established!");
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));   //checking for errors
db.once("open", () => {
    console.log("Database connected");      //successfully connected
});


//executing express
const app = express()

//setting ejs for templating 
app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname,'public')))
//setting middleware to parse form data
app.use(express.urlencoded({extended:true}));

//overriding the method sent by form
app.use(methodOverride('_method'));

//using sessions
const sessionConfig={
    secret:'notagoodsecret',
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,//for security purposes
        expires:Date.now()+1000*60*60*24*7, //expires after a week
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig))
app.use(flash())//for using flash



//defining a middleware for using flash, it need to be done before route handlers
app.use((req,res,next)=>{
    //console.log("!!Hit")
    res.locals.success=req.flash('success');//we will directly have access to this in templates
    res.locals.error=req.flash('error');
    next();
})
// set up all the routes
app.use('/campgrounds',campgrounds)
app.use('/campgrounds/:id/reviews',reviews);


app.get('/', (req, res)=>
{
    res.render('home');
})





app.all("*", (req, res, next)=>
{
    next(new ExpressError("Page Not Found!!", 404));
})

app.use((err, req, res, next)=>
{
    //set default values to status(internal sever error) and message
    const {statusCode = 500} = err;
    if(!err.message)
    {
        err.message = "Something went Wrong!!";
    }
    res.status(statusCode).render('error', {err});
    // res.send("Something went Wrong!!");
})

//Listening on port 3000
app.listen(3000, ()=>
{
    console.log("On port 3000!!");
})