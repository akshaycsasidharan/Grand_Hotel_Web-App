var express = require("express");
var router = express.Router();


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
  paymentpage,
  payment,
  checkavailabilty


} = require("../controllers/userController");


router.get("/",homepage);

router.get("/signup",signuppage);

router.post("/signup",signup);

router.get("/login", loginPage);

router.post("/login", login);

router.get("/allrooms/:id",allrooms);

router.get("/room/:id",room);

router.get("/booking",booking);

router.post("/bookingroom",bookingrooms);

router.get("/payment/:id", paymentpage);

router.post("/dopayment",payment);

router.post("/checkavailability",checkavailabilty);


module.exports = router;
