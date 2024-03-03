const { CURSOR_FLAGS } = require("mongodb");
const { render } = require("../app");
const hotelHelper = require("../helpers/hotelHelper");


module.exports = {
  
  signuppage: (req, res, next) => {
    res.render("hotel/hotelSignup");
  },

  hotelsignup: (req, res) => {
    console.log("@@@@@@@@@2222",req.body);
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
  console.log("!!!!!!!!!!!!!!!!reeeeqqq.body",req.body);
  try {
    hotelHelper.hotelLogin(req.body).then((response) => {
      if (response.status) {
        // res.redirect("/dashboard");
        res.render("hotel/hotelDashboard");

      } else {
        res.redirect("/hotel");
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
