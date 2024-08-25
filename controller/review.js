const Review=require("../models/review");
const Listing=require("../models/listing");
const {listingSchema, reviewSchema}=require("../schema.js")


// Post Route
module.exports.newreview=async (req, res) => {
    let {id} = req.params; 

    let listening = await Listing.findById(id);
    let review = new Review(req.body.review);
    review.author = req.user._id;
    
    listening.reviews.push(review);
    await listening.save();
    let result = await review.save();
    console.log(result);
    req.flash("success","Thanks for your review.")
    res.redirect(`/listings/${id}`);
}

module.exports.deletereview=async (req, res) => {
    let { id, reviewId } = req.params;

    // pull operator basically pull kr leta h matlab sabse pehle vo id dhundega phir uske andar ke reviews naam k array m se revireId dhundega and then usko deltete kr dega
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success","review is created successfully..");
    res.redirect(`/listings/${id}`);

}