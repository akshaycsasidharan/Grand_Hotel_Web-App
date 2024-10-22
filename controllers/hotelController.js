const { CURSOR_FLAGS } = require("mongodb");
const { render, response } = require("../app");
const hotelHelper = require("../helpers/hotelHelper");
const multer = require("multer");

module.exports = {
  signuppage: (req, res, next) => {
    res.render("hotel/hotelSignup");
  },

  hotelsignup: (req, res) => {
    try {
      hotelHelper.hoteldoSignup(req.body, req.file).then((response) => {
        // console.log("$$$$$$$$$$", response);
        res.redirect("/hotel");
      });
    } catch (error) {
      console.log(error);
    }
  },

  hotelloginPage: (req, res, next) => {
    if (req.session.HotelLoggedIn) {
      return res.render("hotel/hotelDashboard");
    } else {
      // Check if login error flag is set in session
      const loginErr = req.session.loginErr ? true : false;
      req.session.loginErr = false; // Reset login error flag
      res.render("hotel/hotelLogin", {
        Hotel: true,
        blocked: req.session.blocked,
        loginErr: loginErr, // Pass login error flag to the view
      });
      req.session.loginErr = false;
      req.session.blocked = false;
    }
  },

  // hotellogin: (req, res, next) => {
  //   try {
  //     hotelHelper.hotelLogin(req.body).then((response) => {
  //       if (response.status) {
  //         req.session.HotelLoggedIn = true;
  //         req.session.hotel = response.hotel;
  //         const hotel = req.session.hotel;

  //         hotelHelper.transactiondetails(hotel).then((transactiondata) => {
  //           // console.log("transactionnnnn---------",transactiondata);

  //           // Call the hoteldashboard function to render the dashboard after successful login
  //           hotelHelper.showdashboard(hotel).then((result) => {
  //             // console.log("Dashboard Count:", result.customerscount);
  //             // console.log("Available Rooms:", result.availableRooms);
  //             // console.log("paidcustomers:", result.paidcustomers);
  //             res.render("hotel/hotelDashboard", {
  //               hotel,
  //               bookingCount: result.bookingCount,
  //               customerscount: result.customerscount,
  //               availableRooms: result.availableRooms,
  //               facilities: result.facilities,
  //               paidcustomers: result.paidcustomers,
  //               roomsCount: result.roomsCount,
  //               transactiondata: transactiondata,
  //             });
  //           });
  //         });
  //       } else {
  //         req.session.loginErr = true; // Set login error flag in session
  //         res.redirect("/hotel"); // Redirect to login page
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.redirect("/"); // Redirect to login page
  //   }
  // },

  hotellogin: (req, res, next) => {

    try {
      hotelHelper.hotelLogin(req.body).then((response) => {
        if (response.status) {
          req.session.HotelLoggedIn = true;
          req.session.hotel = response.hotel;

          const hotel = req.session.hotel;

          hotelHelper.transactiondetails(hotel).then((transactiondata) => {
            // console.log("transactionnnnn---------",transactiondata);

            // Call the hoteldashboard function to render the dashboard after successful login
            hotelHelper.showdashboard(hotel).then((result) => {
              // console.log("Dashboard Count:", result.customerscount);
              // console.log("Available Rooms:", result.availableRooms);
              // console.log("paidcustomers:", result.paidcustomers);
              res.render("hotel/hotelDashboard", {
                hotel,
                bookingCount: result.bookingCount,
                customerscount: result.customerscount,
                availableRooms: result.availableRooms,
                facilities: result.facilities,
                paidcustomers: result.paidcustomers,
                roomsCount: result.roomsCount,
                transactiondata: transactiondata,
              });
            });
          });
        } else if (response.blocked) {
          req.session.blocked = true;
          res.redirect("/hotel"); // Redirect to login page with blocked message
        } else {
          req.session.loginErr = true;
          res.redirect("/hotel"); // Redirect to login page with login error message
        }
      });
    } catch (error) {
      console.log(error);
      res.redirect("/"); // Redirect to login page
    }
  },

  hoteldashboard: (req, res, next) => {
    let hotel = req.session.hotel;

    hotelHelper.transactiondetails(hotel).then((transactiondata) => {
      hotelHelper.showdashboard(hotel).then((result) => {
        // console.log("Dashboard Count:", result.customerscount);
        // console.log("Available Rooms:", result.availableRooms);
        // console.log("paidcustomers:", result.paidcustomers);
        res.render("hotel/hotelDashboard", {
          hotel,
          bookingCount: result.bookingCount,
          customerscount: result.customerscount,
          availableRooms: result.availableRooms,
          facilities: result.facilities,
          paidcustomers: result.paidcustomers,
          roomsCount: result.roomsCount,
          transactiondata: transactiondata,
        });
      });
    });
  },

  addroomspage: (req, res) => {
    res.render("hotel/addRooms");
  },

  addfacilitiespage: (req, res) => {
    res.render("hotel/addFacilities");
  },

  addrooms: (req, res) => {
    // console.log("addroomssssssssss ======");
    let hotel = req.session.hotel;
    // console.log("reqqqq.params.idd",req.params.id);
    try {
      hotelHelper
        .addrooms(req.body, req.file, hotel)
        .then((insertedId) => {
          res.redirect("/hotel/rooms");
        })
        .catch((error) => {
          console.error("Error adding room:", error);
          res.status(500).send("Error adding room");
        });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error adding room");
    }
  },

  roomspage: (req, res) => {
    let hotel = req.session.hotel;
    hotelHelper.viewrooms(hotel).then(async (viewdata) => {
      res.render("hotel/rooms", {
        viewdata,
        hotel,
      });
    });
  },

  addfacilities: (req, res) => {
    let hotel = req.session.hotel;

    // console.log("@@@@@@@@@@@@@@@@@@", req.body);
    try {
      hotelHelper.addfacility(req.body, req.file, hotel).then((response) => {
        // console.log("%%%%%%%%%%%%%%%%%",response);
        res.redirect("/hotel/facilities");
      });
    } catch (error) {
      console.log(error);
    }
  },

  facilitypage: (req, res) => {
    let hotel = req.session.hotel;

    console.log("###########22222222", hotel);

    hotelHelper.viewfacility(hotel).then((facilitiesdata) => {
      res.render("hotel/facilities", {
        facilitiesdata,
        hotel,
      });
    });
  },

  editrooms: (req, res) => {
    let id = req.params.id;

    hotelHelper.editroom(id).then((result) => {
      res.render("hotel/editRooms", { result });
    });
  },

  roomedit: (req, res) => {
    let id = req.params.id;

    hotelHelper.roomedit(id, req.body, req.file).then(() => {
      res.redirect("/hotel/rooms");
    });
  },

  deleteroom: (req, res) => {
    let id = req.params.id;
    hotelHelper.roomdelete(id).then(() => {
      res.redirect("/hotel/rooms"); // Corrected redirect path
    });
  },

  editfacilities: (req, res) => {
    let facilityid = req.params.id;
    hotelHelper.editfacility(facilityid).then((data) => {
      res.render("hotel/editFacilities", { data });
    });
  },

  facilityedit: (req, res) => {
    let idfacility = req.params.id;
    hotelHelper.facilityedit(idfacility, req.body, req.file).then(() => {
      res.redirect("/hotel/facilities");
    });
  },

  deletefacilities: (req, res) => {
    let id = req.params.id;
    hotelHelper.facilitiesdelete(id).then(() => {
      res.redirect("/hotel/facilities");
    });
  },

  customers: (req, res) => {
    let hotel = req.session.hotel;

    console.log("111111111111", hotel);
    hotelHelper.showcustomers(hotel).then(async (customerdata) => {
      res.render("hotel/hotelCustomers", {
        customerdata,
        hotel,
      });
    });
  },

  transactions: (req, res) => {
    let hotel = req.session.hotel;
    hotelHelper.transactiondetails(hotel).then((transactiondata) => {
      res.render("hotel/transactions", {
        transactiondata,
        hotel,
      });
    });
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/hotel");
  },
};
