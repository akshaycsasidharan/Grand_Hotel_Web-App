const { CURSOR_FLAGS } = require("mongodb");
const { render, response } = require("../app");
const adminHelper = require("../helpers/adminHelper");

module.exports = {
  
  adminloginPage: (req, res, next) => {
    // console.log("@@@@@@@@@2helloooooo");

    res.render("admin/adminLogin");
  },


  adminlogin: (req, res, next) => {
    try {
        adminHelper.doAdminLogin(req.body)
            .then((response) => {
                if (response) {
                  res.redirect("/admin/dashBoard"); 
                } else {
                  res.redirect("/admin"); 
                }
            })
            .catch((error) => {
                console.error(error);
                res.redirect("/error"); 
            });
    } catch (error) {
        console.error(error);
        res.redirect("/error");
    }
},


hotelpage: (req,res) => {
  adminHelper.getHotelsData().then(async(hotelsdata) => {
    // console.log("@@@@@@@@@@@@@@@@@@@hotelssssssssssdata",hotelsdata);
    res.render("admin/hotels", {
      hotelsdata
    })
  })

},


block: (req, res, next) => {
  
  const id = req.params.id; 
  adminHelper.blockUser(id).then(() => {
    res.redirect("/admin/hotels");
  }).catch(error => {
    // console.error(error);
    res.status(500).send("Error blocking user");
  });
},


unblock: (req, res) => {
  const id = req.params.id; 
  adminHelper.unblockUser(id).then(() => {
    res.redirect("/admin/hotels");
  }).catch(error => {
    // console.error(error);
    res.status(500).send("Error unblocking user");
  });
},


customers: (req,res) => {
  adminHelper.getcutomerdata().then(async(customerdata) => {
    res.render("admin/customerDetails", {
      customerdata
    });
  });
},


// transactionspage:(req,res) => {
//   res.render("admin/transactions");
// },



transactionspage: (req, res) => {

  adminHelper.transactiondetails().then((transactiondata) => {

    res.render("admin/transactions", {
      transactiondata
    });

  })
},


// dashboard:(req,res) => {
//   res.render("admin/dashBoard")
// },



hoteldashboard: (req, res, next) => {

  adminHelper.transactiondetails().then((transactiondata) => {


  adminHelper.showhoteldashboard().then((result) => {
    // console.log("Dashboard Count:", result.customerscount);
    // console.log("Available Rooms:", result.availableRooms);
    // console.log("paidcustomers:", result.paidcustomers);
    res.render("admin/dashBoard", {
      paymentcount:result.paymentcount,
      facilitiescount:result.facilitiescount,
      hotels:result.hotels,
      customerscount: result.customerscount,
      roomsCount: result.roomsCount,
      facilities: result.facilities,
      transactiondata:transactiondata,
       bookingCount: result.bookingCount,
    });
  });
 });
},





};