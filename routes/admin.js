var express = require("express");
var router = express.Router();
var { connectToMongoDB } = require("../config/connection");
var collection = require("../config/collection");
var adminHelper = require("../helpers/adminHelper");


const {
  adminloginPage,
  adminlogin,
  dashboard,
  block,
  unblock

} = require("../controllers/adminController");




router.get("/", adminloginPage);

router.post("/adminlogin", adminlogin);

router.get("/dashboard", dashboard);

router.post("/block/:id",block);

 router.post("/unblock/:id",unblock);

module.exports = router;
