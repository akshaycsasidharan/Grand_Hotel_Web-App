var express = require("express");
var router = express.Router();


const {
 
  loginPage,
  signuppage,
  signup,
  homepage,
  allrooms,
  room,
  login

} = require("../controllers/userController");


router.get("/",homepage);

router.get("/signup",signuppage);

router.post("/signup",signup);

router.get("/login", loginPage);

router.post("/login", login);

router.get("/allrooms",allrooms);


router.get("/room",room);



module.exports = router;
