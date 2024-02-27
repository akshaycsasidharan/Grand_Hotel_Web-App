// userinte login pg, functionalities signup,

const { CURSOR_FLAGS } = require("mongodb");
const userHelper = require("../helpers/userHelper");

module.exports = {
  
  loginPage: (req, res, next) => {
    // console.log("@@@@@@@@@2helloooooo");
    res.render("user/login");
  },

  signuppage:(req,res) => {

    res.render("user/signupPage");
  }

};
