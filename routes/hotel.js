var express = require("express");
var router = express.Router();
const  verifyhotelToken  = require("../middleware/hotelMiddleware");


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
  facilitypage,
  deleteroom,
  deletefacilities,
  roomedit,
  facilityedit
} = require("../controllers/hotelController");


router.get("/hotelssignup",signuppage);

router.post("/hotelsignup",upload.single('image'),hotelsignup);

router.get("/", hotelloginPage);

router.post("/hotellogin", hotellogin);

router.get("/hoteldashboard",verifyhotelToken,hoteldashboard);

router.get("/customers",customers);

router.get("/rooms",roomspage);

router.post("/delete/:id",deleteroom);

router.post("/deleted/:id",deletefacilities);

router.get("/facilities",facilitypage);

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
