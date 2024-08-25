const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
module.exports.isLoggedIn = (req,res,next) => {
    // console.log(req.originalUrl);
    req.session.redirectUrl = req.originalUrl;
    if(!req.isAuthenticated()){
        req.flash("error","you'r not logged in.");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}

module.exports.isOwner =async (req,res,next) => {
    let {id} = req.params;
    let listing =await Listing.findById(id);
    let owner = listing.owner;

    let currUser = res.locals.currUser._id;

    
    if(!(owner.equals(currUser))){
        req.flash("error","You don't have permission.");
        // return res.send("not allowed");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



module.exports.isReviewAuthor = async (req,res,next) => {
    let {reviewId , id} = req.params;

    let review = await Review.findById(reviewId);


    if(!(review.author.equals(res.locals.currUser._id))){
        req.flash("error","This action is not allowed to you.");
        return res.redirect(`/listings/${id}`);
    }
    next();
}