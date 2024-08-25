const User=require("../models/user");


module.exports.getsignupform=async(req,res) => {
    res.render("users/signup.ejs");
}

module.exports.getloginform=(req,res) => {
    res.render("users/login.ejs"); 
}

module.exports.signup=async(req,res)=>{
    try {
        let {username , email , password} = req.body;
        const u1 = new User({email,username});
        
        let result = await User.register(u1,password);
        req.login(result, err => {
            if(err){
                return next(err);
            }
            // console.log(result);
            res.redirect("/listings");
        })
    } catch (error) {
        req.flash("error",error.message);
        res.redirect("/signup");
    }
}

module.exports.login=(req,res)=>{
    req.flash('success', 'You have successfully logged in');

    // esko esa esliye likha because agar humne directly login kra to isloogedin wala middleware call he nhi hua agar vo call nhi hua to session m trigger he nhi hua so usme kuch path aaya he nhi soesliye
    const url = res.locals.redirectUrl || "/listings";
    res.redirect(url);
}

module.exports.logout=async (req,res) => {
    req.logout( err => {
        if(err){
            return next(err);
        }

        req.flash("success","Logged-Out successfully");
        res.redirect("/listings");

    })
}