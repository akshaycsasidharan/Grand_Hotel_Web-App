var express = require("express");
var router = express.Router();


const {
 
  hotelloginPage

} = require("../controllers/hotelController");



router.get("/", hotelloginPage);



module.exports = router;
