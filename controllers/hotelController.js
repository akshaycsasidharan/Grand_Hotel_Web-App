// userinte login pg, functionalities signup,

const { CURSOR_FLAGS } = require("mongodb");
const userHelper = require("../helpers/hotelHelper");

module.exports = {
  
    hotelloginPage: (req, res, next) => {
    // console.log("@@@@@@@@@2helloooooo");

    res.render("hotel/hotelLogin");
  }

};
