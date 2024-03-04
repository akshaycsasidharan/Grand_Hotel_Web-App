const { CURSOR_FLAGS } = require("mongodb");
const { render } = require("../app");
const hotelHelper = require("../helpers/hotelHelper");


module.exports = {
  
  signuppage: (req, res, next) => {
    res.render("hotel/hotelSignup");
  },

  hotelsignup: (req, res) => {
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
  res.render("hotel/hotelLogin");
},

hotellogin: (req, res) => {
  try {
    hotelHelper.hotelLogin(req.body).then((response) => {
      console.log("Response:", response);

      if (response.status && !response.user.blocked) {
        res.redirect("hoteldashboard");
      } else {
        res.redirect("/hotel");
      }
    });
  } catch (error) {
    console.log(error);
  }
},


hoteldashboard:(req,res,next)=>{
  res.render("hotel/hotelDashboard");
},

}
