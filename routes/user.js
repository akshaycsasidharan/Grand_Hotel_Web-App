var express = require("express");
var router = express.Router();
var { connectToMongoDB } = require("../config/connection");
var collection = require("../config/collection");
var userHelper = require("../helpers/userHelper");



const {
 
  loginPage

} = require("../controllers/userController");



router.get("/", loginPage);



module.exports = router;
