var express = require("express");
var router = express.Router();

const {
  adminloginPage,
  adminlogin,
  hoteldashboard,
  block,
  unblock,
  customers,
  hotelpage,
  transactionspage,
} = require("../controllers/adminController");

router.get("/", adminloginPage);

router.post("/adminlogin", adminlogin);

router.get("/dashboard", hoteldashboard);

router.post("/block/:id", block);

router.post("/unblock/:id", unblock);

router.get("/customers", customers);

router.get("/hotels", hotelpage);

router.get("/transactions", transactionspage);

module.exports = router;
