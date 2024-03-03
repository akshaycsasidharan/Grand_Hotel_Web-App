var express = require("express");
var router = express.Router();


const {
 
  hotelloginPage,
  hotellogin,
  signuppage,
  signup,
  dashboard

} = require("../controllers/hotelController");



router.get("/", hotelloginPage);

router.post("/", hotellogin);

router.get("/hotelsignup",signuppage);

router.post("/hotelsignup",signup);

router.get("/dashboard",dashboard);


module.exports = router;
