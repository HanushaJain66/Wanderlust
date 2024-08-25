if(process.env.NODE_ENV!="production")
{
  require('dotenv').config();
}

const express=require("express")
const app=express();
const mongoose=require("mongoose")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate")
const {listingSchema, reviewSchema}=require("./schema.js")
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const users=require("./routes/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./models/user.js");


const MONGO_URL=process.env.MONGO_DB_CONNECTION;
const passport = require("passport");
const LocalStratergy = require("passport-local");
const { error } = require('console');


async function main()
{
    await mongoose.connect(MONGO_URL);
}

// console.log(MONGO_URL)

main().then(()=>{
    console.log("Connection successfull")
}).catch((error)=>{
    console.log("Error in making connection",error)
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// setting up the session-options

const store=MongoStore.create({
  mongoUrl: MONGO_URL,
  crypto:{
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
})


store.on("error",()=>{
  console.log("Error on connecting to mongo store");
})
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    exprires:Date.now() + 1000*60*60*24*7,
    maxAge:1000*60*60*24*7,
    httpOnly:true
}
}


app.use(session(sessionOptions));
app.use(flash());
// Using the listing routes from the router


// flash messages display karvane k liye



// passport wala sara kaam abb edhar krna h
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  console.log(  res.locals.currUser );
  next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",users);



  // For all the random pages and routes
app.all("*",(req,res)=>{
  res.status(404).send("Page Not found");
})

const port=8080;
app.listen(8080,()=>{
    console.log("Server is listening on port " , port);
})