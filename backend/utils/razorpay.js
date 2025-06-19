const Razorpay = require("razorpay");
require("dotenv").config(); // Add this line if not already in your entry point (like app.js)



const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;
