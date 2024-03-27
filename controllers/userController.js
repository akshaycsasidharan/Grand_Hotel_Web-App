const { CURSOR_FLAGS } = require("mongodb");
const userHelper = require("../helpers/userHelper");
const { render } = require("../app");
const multer = require("multer");


module.exports = {

  signuppage:(req,res) => {

    res.render("user/signupPage");
  },

  signup:(req,res) => {
    // console.log("##################3",req.body);

    try {
      userHelper.doSignup(req.body).then((response) => {
        // console.log(response);
        res.redirect("/login");
      });
    } catch (error) {
      console.log(error);
    }

  },


  loginPage: (req, res, next) => {
    // console.log("@@@@@@@@@2helloooooo");
    res.render("user/login");
  },


login: (req, res, next) => {
  try {
    userHelper.doLogin(req.body).then((response) => {
      console.log("#############33",response);
      if (response.status) {
        res.redirect("/allRooms"); 
      } else {
        res.render("user/login", { error: response.message });
      }
    });
  } catch (error) {
    console.log(error);
  }
},

booking:(req,res) =>{
  res.render("user/booking");
},

bookingrooms:(req,res) => {

try {
  userHelper.dobooking(req.body).then((result) => {
    console.log(result);
    res.redirect("/booking");
  });
} catch (error) {
  console.log(error);
}

},

payments:(req,res) => {
  res.render("user/payment");

},

  homepage:(req,res) => {
    userHelper.showhotels().then((hotelssdata) => {
      res.render("user/homePage",{
        hotelssdata,
      });
    })
  },


  allrooms:(req,res) => {
    userHelper.showrooms().then((roomsdata) => {
      res.render("user/allRooms",{
        roomsdata
      });
    })

  },


  room: (req, res) => {
    let id = req.params.id;
    try {
         userHelper.roomsDetails(id).then((roomDetails)=>{
          res.render("user/room", { roomDetails });
         });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching room details");
    }
  }


}
