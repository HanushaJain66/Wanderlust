const express = require("express");
const router = express.Router();
const Listing=require("../models/listing");
const {listingSchema, reviewSchema}=require("../schema.js");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const listingcontroller=require("../controller/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({ storage })

const validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body.error);
        if(error)
        {
          res.render("error.ejs",error);
        }else{
          next();
        }
  }

router
.route("/")
.get( listingcontroller.getalllisting)
.post( validateListing,upload.single('listing[image]'), isLoggedIn,listingcontroller.createlisting);



//New Route
//   Edhar new ko create krne ke loye esko show ko upar rakha he taki cinfusion nho
router.get("/new", isLoggedIn ,listingcontroller.newlisting);




//Edit Route
router.get("/:id/edit", validateListing,isLoggedIn, isOwner,listingcontroller.editlisting);


//Update Route and Delete Route and create route
router.route("/:id").put(isLoggedIn, upload.single('listing[image]'),isOwner,listingcontroller.updatelisting).delete(isLoggedIn, isOwner,listingcontroller.deletelisting).get(listingcontroller.show);





module.exports = router;