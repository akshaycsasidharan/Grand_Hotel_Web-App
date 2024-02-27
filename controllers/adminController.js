// userinte login pg, functionalities signup,

const { CURSOR_FLAGS } = require("mongodb");
const userHelper = require("../helpers/userHelper");

module.exports = {
  
    adminloginPage: (req, res, next) => {
    // console.log("@@@@@@@@@2helloooooo");

    res.render("admin/adminLogin");
  }

};
