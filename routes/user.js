var express = require("express");
var router = express.Router();
const passport = require("passport");
const { verifyUser, notVerifyUser } = require("../middleware/userMiddleware");

router.use(passport.initialize());
router.use(passport.session());

const {
  serializeUser,
  deserializeUser,
  useGoogleStrategy,
} = require("../public/javascripts/passport");

const {
  loginPage,
  signuppage,
  signup,
  homepage,
  allrooms,
  allfacilities,
  room,
  login,
  booking,
  bookingrooms,
  payment,
  checkavailabilty,
  logout,
  receipt,
  userprofile,
  updateuserpage,
  updateuser,
  changeuserPasswordpage,
  changeuserpassword,
  successGoogleLogin,
  failureGoogleLogin,
} = require("../controllers/userController");

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);



router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/failure",
  })
);

router.get("/success", successGoogleLogin);

router.get("/failure", failureGoogleLogin);




router.get("/userprofile", userprofile);

router.get("/update", updateuserpage);

router.post("/updateuser", updateuser);

router.get("/changeuserPassword", changeuserPasswordpage);

router.post("/changepassword", changeuserpassword);

router.get("/", homepage);

router.get("/signup/:id", signuppage);

router.post("/signup/:id", signup);

router.get("/login/:id", loginPage);

router.post("/login/:id", login);

router.get("/allrooms/:id", allrooms);

router.get("/allfacilities/:id", allfacilities);

router.get("/room/:id", room);

router.get("/booking/:id", booking);

router.post("/bookingroom/:id", bookingrooms);

router.post("/dopayment", payment);

router.post("/checkavailability/:id", checkavailabilty);

router.get("/logout", logout);

router.get("/receipt", receipt);

module.exports = router;
