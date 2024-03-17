var express = require("express");
var router = express.Router();



const {
  adminloginPage,
  adminlogin,
  dashboard,
  block,
  unblock,
  customers,
  hotelpage,
  transactionspage,
  reviewspage


} = require("../controllers/adminController");




router.get("/", adminloginPage);

router.post("/adminlogin", adminlogin);

router.get("/dashboard", dashboard);

router.post("/block/:id",block);

router.post("/unblock/:id",unblock);

router.get("/customers",customers);

router.get("/hotels", hotelpage);

router.get("/transactions", transactionspage);

router.get("/reviews", reviewspage);


module.exports = router;
