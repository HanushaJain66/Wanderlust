const express = require("express");
const passport = require("passport");
const router = express.Router();
const User=require("../models/user");
const {saveRedirectUrl}= require("../middleware.js");
const usercontroller=require("../controller/user.js");
    

router.get("/signup",usercontroller.getsignupform);

router.get("/login",usercontroller.getloginform);

router.post("/signup",usercontroller.signup);


router.post("/login",saveRedirectUrl,passport.authenticate("local", {failureRedirect: "/signup",failureFlash: true }),usercontroller.login);


router.get("/logout",usercontroller.logout);
module.exports=router;
