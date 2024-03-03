var express = require("express");
var router = express.Router();


const {
 
  hotelloginPage,
  hotellogin,
  signuppage,
  hotelsignup,
  dashboard

} = require("../controllers/hotelController");


router.get("/hotelssignup",signuppage);

router.post("/hotelsignup",hotelsignup);

router.get("/", hotelloginPage);

router.post("/hotellogin", hotellogin);

router.get("/dashboard",dashboard);


module.exports = router;
