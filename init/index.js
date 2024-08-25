
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderland";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

async function initDB() {
  try {
    await Listing.deleteMany({});
    initData.data = initData.data.map( obj => ({...obj,owner:"66bcaa8df9199c129684fa1d"}));
    await Listing.insertMany(initData.data);
  } catch (error) {
    console.error("Error initializing data:", error);
  }
}

initDB();
