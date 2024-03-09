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

// addhotel:(req,res) => {
//   res.render("hotel/addRooms")
// },

addrooms:(req,res) => {
  res.render("hotel/addRooms")
},

editrooms:(req,res) => {
  res.render("hotel/editRooms");
},

addfacilities:(req,res)=>{
  res.render("hotel/addFacilities");
},

editfacilities:(req,res)=>{
  res.render("hotel/editFacilities");
},

customers:(req,res) => {
  hotelHelper.showcustomers().then(async(customerdata) => {
    res.render("hotel/hotelCustomers",{
      customerdata

    });

  })
},

transactions:(req,res) => {
  res.render("hotel/transactions");
},

reviews:(req,res) => {
  res.render("hotel/reviews");
},

roomspage:(req,res) => {
  res.render("hotel/rooms");
},

facilities:(req,res) => {
  res.render("hotel/facilities");
}

// customers: (req,res) => {
//   adminHelper.getcutomerdata().then(async(customerdata) => {
//     res.render("hotel/customerDetails", {
//       customerdata
//     });
//   });
// },






}
