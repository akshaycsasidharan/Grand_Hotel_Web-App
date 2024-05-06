var express = require("express");
var router = express.Router();
const {verifyUser ,notVerifyUser} = require("../middleware/userMiddleware");


// const {

//   sendOTP

// }= require ("../public/javascripts/otplogin");

const {
 
  loginPage,
  signuppage,
  signup,
  homepage,
  allrooms,
  room,
  login,
  booking,
  bookingrooms,
  payment,
  checkavailabilty,
  logout,
  receipt,
otploginpage

} = require("../controllers/userController");


router.get("/otploginpage",otploginpage);

router.get("/",homepage);

router.get("/signup/:id",signuppage);

router.post("/signup/:id",signup);

router.get("/login/:id", loginPage);

router.post("/login/:id", login);

router.get("/allrooms/:id",allrooms);

router.get("/room/:id",room);

router.get("/booking/:id",booking);

router.post("/bookingroom/:id", bookingrooms);


router.post("/dopayment",payment);

router.post("/checkavailability/:id",checkavailabilty);

router.get("/logout",logout);

router.get("/receipt",receipt);


module.exports = router;
