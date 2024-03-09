var express = require("express");
var router = express.Router();


const {
 
  hotelloginPage,
  hotellogin,
  signuppage,
  hotelsignup,
  hoteldashboard,
  addrooms,
  editrooms,
  addfacilities,
  editfacilities,
  customers,
  transactions,
  reviews,
  roomspage,
  facilities
} = require("../controllers/hotelController");


router.get("/hotelssignup",signuppage);

router.post("/hotelsignup",hotelsignup);

router.get("/", hotelloginPage);

router.post("/hotellogin", hotellogin);

router.get("/hoteldashboard",hoteldashboard);

router.get("/customers",customers);

router.get("/rooms",roomspage);

router.get("/facilities",facilities);

router.get("/addrooms",addrooms);

router.get("/editrooms",editrooms);

router.get("/addfacilities",addfacilities);

router.get("/editfacilities",editfacilities);

router.get("/transactions",transactions);

router.get("/reviews",reviews);


module.exports = router;
