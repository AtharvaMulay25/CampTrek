const express=require('express');
const router=express.Router();
const User=require('../models/user')
const catchAsync=require('../utilities/catchAsync');
const passport = require('passport');
const {storeReturnTo}=require('../middleware')

router.get('/register',(req,res)=>{
    res.render('users/register')
})
router.post('/register',catchAsync(async(req,res,next)=>{
    try{
    const {username,email,password}=req.body
    const user=new User({email,username});
    const registeredUser=await User.register(user,password);
    req.login(registeredUser,err=>{
        if(err){
            return next(err)
        }
        req.flash('success','Welcome to Camp-Trek!!');
        res.redirect('/campgrounds');
    })
    //console.log(registeredUser);
    }catch(e){
        req.flash('error',e.message);
        res.redirect('register');
    }
}))

router.get('/login',(req,res)=>{
    res.render('users/login')
})
router.post('/login',storeReturnTo,passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome Back!');
    const redirectUrl=res.locals.returnTo||'/campgrounds'
    //delete req.session.returnTo
    res.redirect(redirectUrl);
})

//*******************there is no next added here in callback, code can break
router.get('/logout',(req,res)=>{
    req.logout(function (err){
        if(err){
            return next(err);
        }
        req.flash('success','Successfully logged out')
        res.redirect('/campgrounds')
    })
    
})


module.exports=router