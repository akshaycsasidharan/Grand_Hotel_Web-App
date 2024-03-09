const { CURSOR_FLAGS } = require("mongodb");
const userHelper = require("../helpers/userHelper");
const { render } = require("../app");

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


  homepage:(req,res) => {
    res.render("user/homePage");
  },


  allrooms:(req,res) => {
    res.render("user/allRooms");
  },


  room:(req,res)=>{
    res.render("user/room");
  }


};
