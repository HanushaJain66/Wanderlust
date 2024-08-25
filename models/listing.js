const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review=require('./review.js');



const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

//   here default is use to set the value of the image and the set will see if the image is empty string then it will set it to that value
image: {
  url:String,
  filename:String
  },
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref: "Review"
    }
    

  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User",
}
});


listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
