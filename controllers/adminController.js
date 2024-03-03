const { CURSOR_FLAGS } = require("mongodb");
const { render, response } = require("../app");
const adminHelper = require("../helpers/adminHelper");

module.exports = {
  adminloginPage: (req, res, next) => {
    // console.log("@@@@@@@@@2helloooooo");

    res.render("admin/adminLogin");
  },

  adminlogin: (req, res, next) => {

    // console.log("@@@@@@@@@@@22222",req.body);

    try {
      adminHelper.doAdminLogin(req.body).then(() => {
        if (response) {
          res.redirect("/admin");

          // res.redirect("/admin/dashBoard");
        } else {
          res.redirect("/admin/dashBoard");

          // res.redirect("/admin");
        }
      });
    } catch (error) {
      console.log(error);
    }
  },

  dashboard: (req, res, next) => {

  adminHelper.getHotelsData().then(async() => {
    res.render("admin/dashBoard", {
      
    })
  })
},



};
