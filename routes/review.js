const express = require("express");
const router = express.Router({mergeParams: true});
const Review=require("../models/review");
const Listing=require("../models/listing");
const {listingSchema, reviewSchema}=require("../schema.js")
const {isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewcontroller=require("../controller/review.js");

const validateReview=(req,res,next)=>{
    const {error}=reviewSchema.validate(req.body.error);
        if(error)
        {
          res.render("error.ejs",error);
        }else{
          next();
        }
  }

// REVIEWS
// Post Route
console.log("hi");
router.post("/", isLoggedIn,validateReview, reviewcontroller.newreview);


// delete route reviews
router.delete("/:reviewId", isLoggedIn,isReviewAuthor,reviewcontroller.deletereview);

module.exports = router;