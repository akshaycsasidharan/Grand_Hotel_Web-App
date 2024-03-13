var express = require("express");
var router = express.Router();

const {

  upload

}= require ("../public/javascripts/multer");


const {
 
  hotelloginPage,
  hotellogin,
  signuppage,
  hotelsignup,
  hoteldashboard,
  addroomspage,
  addrooms,
  editrooms,
  addfacilitiespage,
  addfacilities,
  editfacilities,
  customers,
  transactions,
  reviews,
  roomspage,
  facilities,
  deleteroom,
  deletefacilities
} = require("../controllers/hotelController");


router.get("/hotelssignup",signuppage);

router.post("/hotelsignup",hotelsignup);

router.get("/", hotelloginPage);

router.post("/hotellogin", hotellogin);

router.get("/hoteldashboard",hoteldashboard);

router.get("/customers",customers);

router.get("/rooms",roomspage);

router.post("/delete/:id",deleteroom);

router.post("/deleted/:id",deletefacilities);

router.get("/facilities",facilities);

router.get("/addrooms",addroomspage);

router.post("/addrooms",upload.single('image'),addrooms);

router.get("/addfacilities",addfacilitiespage);

router.post("/addfacilities",upload.single('image'),addfacilities);

router.get("/editrooms",editrooms);

router.get("/editfacilities",editfacilities);

router.get("/transactions",transactions);

router.get("/reviews",reviews);


module.exports = router;
