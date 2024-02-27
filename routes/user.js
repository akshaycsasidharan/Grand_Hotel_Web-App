var express = require("express");
var router = express.Router();


const {
 
  loginPage,
  signuppage

} = require("../controllers/userController");



router.get("/", loginPage);

router.get("/signup",signuppage);



module.exports = router;
