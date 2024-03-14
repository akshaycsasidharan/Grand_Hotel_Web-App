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
  facility,
  deleteroom,
  deletefacilities,
  roomedit,
  facilityedit
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

router.get("/facilities",facility);

router.get("/addrooms",addroomspage);

router.post("/addrooms",upload.single('image'),addrooms);

router.get("/addfacilities",addfacilitiespage);

router.post("/addfacilities", upload.single('image'), addfacilities);

router.get("/edit/:id",editrooms);

router.post("/editrooms/:id",upload.single('image'),roomedit);

router.get("/editfacility/:id",editfacilities);

router.post("/editfacilities/:id",upload.single('image'),facilityedit);


router.get("/transactions",transactions);

router.get("/reviews",reviews);


module.exports = router;
