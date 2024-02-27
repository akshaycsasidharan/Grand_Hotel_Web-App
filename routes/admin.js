var express = require("express");
var router = express.Router();



const {
 
  adminloginPage

} = require("../controllers/adminController");



router.get("/", adminloginPage);



module.exports = router;
