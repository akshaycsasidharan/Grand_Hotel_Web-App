var express = require("express");
var router = express.Router();
var { connectToMongoDB } = require("../config/connection");
var collection = require("../config/collection");
var adminHelper = require("../helpers/adminHelper");


const {
  adminloginPage,
  dashboard,
  adminlogin,
} = require("../controllers/adminController");




router.get("/", adminloginPage);

router.post("/adminlogin", adminlogin);

router.get("/dashboard", dashboard);

module.exports = router;
