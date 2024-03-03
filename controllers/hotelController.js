const { CURSOR_FLAGS } = require("mongodb");
const { response } = require("../app");
const hotelHelper = require("../helpers/hotelHelper");


module.exports = {
  
  signuppage: (req, res, next) => {
    res.render("hotel/hotelSignup");
  },

  signup: (req, res) => {
    // console.log("@@@@@@@@@2222",req.body);

    try {
      hotelHelper.hoteldoSignup(req.body).then((response) => {
        res.redirect("/hotel");
      });
    } catch (error) {
      console.log(error);
    }
},



hotelloginPage: (req, res, next) => {
  // console.log("@@@@@@@@@2helloooooo");
  res.render("hotel/hotelLogin");
},

hotellogin: (req, res, next) => {
  try {
    hotelHelper.hotelLogin(req.body).then((response) => {
      if (response.status) {
        req.session.loggedIn = true;
        req.session.user = response.user;
        res.redirect("/hotel/hotelDashboard");
      } else {
        res.redirect("/");
      }
    });
  } catch (error) {
    console.log(error);
  }
},


dashboard:(req,res,next)=>{
  res.render("hotel/hotelDashboard");
},

}
