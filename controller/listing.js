const Listing=require("../models/listing");
const {listingSchema, reviewSchema}=require("../schema.js");
const {isLoggedIn}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

module.exports.getalllisting=async (req, res) => {
    try {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    }
    catch (err) {

        const mssg = err._message;
        res.render("error.ejs", { mssg });
    }
}

//New Route
//   Edhar new ko create krne ke loye esko show ko upar rakha he taki cinfusion nho
module.exports.newlisting=(req, res) => {
    try {
        res.render("listings/new.ejs");
    }
    catch (err) {
        const mssg = err._message;
        res.render("error.ejs", { mssg });
    }

}

//   show route
module.exports.show=async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) {
            const mssg = err._message;
            res.render("error.ejs", { mssg });
        }
        const listing = await Listing.findById(id)
        .populate({
            path:"reviews",
            populate:{path:"author"}
        }
    )
    .populate("owner");
        // console.log(listing);
        if(!listing)
        {
            req.flash("error","Listing you requested does not exist");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    }
    catch (err) {
        const mssg = err._message;
        res.render("error.ejs", { mssg });
    }

}


// create route
module.exports.createlisting=async (req, res) => {
    try {
        let url = req.file.path;
        let filename = req.file.filename;
        if(!req.body.listing){
            throw new ExpressError(400,"A bad request")
        }
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = {url,filename};
        // const newListing = new Listing(req.body.listing);
        if (!newListing) {
            const mssg = err._message;
            res.render("error.ejs", { mssg });
        }

        // because each time when we are adding the listing we need to get the owner and the request object store the details of the owner
        await newListing.save();
        req.flash("success","Listing is created successfully..");
        res.redirect("/listings");
    }
    catch (err) {
        const mssg = err._message;
        res.render("error.ejs", { mssg });
    }
}

//Edit Route
module.exports.editlisting=async (req, res) => {
    try {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if(!listing)
            {
                req.flash("error","Listing you requested does not exist");
                res.redirect("/listings");
            }
        // let previewUrl = listing.image.url;
        // previewUrl = previewUrl.replace("/upload","/upload/h_300,w_150");
        req.flash("success","Listing is Edited successfully..");
        res.render("listings/edit.ejs", { listing });
    }
    catch (err) {
        const mssg = err._message;
        res.render("error.ejs", { mssg });
    }
}

//Update Route
module.exports.updatelisting=async (req, res) => {
    try {
        
        let { id } = req.params;
        let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

        if(typeof req.file!=="undefined")
        {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image={url,filename};
    
            await listing.save();
        }
       
        req.flash("success","Listing is Updated successfully..");
        res.redirect(`/listings/${id}`);
    }
    catch (err) {
        const mssg = err._message;
        res.render("error.ejs", { mssg });
    }
}

// delete route
module.exports.deletelisting=async (req, res) => {
    try {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        // console.log(deletedListing);
        req.flash("success","Listing is deleted successfully..");
        res.redirect("/listings");
    }
    catch (err) {
        const mssg = err._message;
        res.render("error.ejs", { mssg });
    }
}