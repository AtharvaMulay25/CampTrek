const User=require('../models/user')




module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register')
}

module.exports.register = async(req,res,next)=>{
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
}


module.exports.renderLoginForm  = (req,res)=>{
    res.render('users/login')
}

module.exports.login = (req,res)=>{
    req.flash('success','Welcome Back!');
    const redirectUrl=res.locals.returnTo||'/campgrounds'
    //delete req.session.returnTo
    res.redirect(redirectUrl);
}

//*******************there is no next added here in callback, code can break
module.exports.logout = (req,res)=>{
    req.logout(function (err){
        if(err){
            return next(err);
        }
        req.flash('success','Successfully logged out')
        res.redirect('/campgrounds')
    })
    
}