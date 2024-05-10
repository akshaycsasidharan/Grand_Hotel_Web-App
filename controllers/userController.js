const { CURSOR_FLAGS } = require("mongodb");
const userHelper = require("../helpers/userHelper");
const { render } = require("../app");
const multer = require("multer");
const Razorpay = require("razorpay");
var { connectToMongoDB } = require("../config/connection");
const { ObjectId } = require("mongodb");
var collection = require("../config/collection");
const nodemailer = require("nodemailer");

const puppeteer = require("puppeteer");
const path = require("path");
const { error } = require("console");
const { log } = require("handlebars/runtime");

// const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_8cTRaG2qyqmSGG",
  key_secret: "lPhtD4Guxq3dUurYJLs9OwXi",
});

module.exports = {
  signuppage: (req, res) => {
    let id = req.params.id;
    console.log("iddddddddd", id);
    res.render("user/signupPage", { id: id });
  },

  signup: async (req, res) => {
    let id = req.params.id;
    // console.log("iiiiiiiidddddddddd..........",id);
    // console.log("##################3",req.body);

    try {
      // Assuming roomId is obtained from somewhere
      // const roomId = id.roomId;

      // Retrieve room details using roomId
      const roomDetails = await userHelper.roomsDetails(id);
      const hotelId = roomDetails.hotelId;
      const roomId = roomDetails.roomId;

      // console.log("33333333333333333333",roomId,hotelId);

      // Call doSignup with retrieved hotelId and roomId
      await userHelper.doSignup(req.body, hotelId, roomId).then((response) => {
        // console.log(response);

        //   res.render("user/login", {
        //     signupMessage: "signup success ",
        //     id: id // Pass room details to the view
        // });

        res.redirect("/login/" + id);
      });
    } catch (error) {
      console.log(error);
    }
  },

  loginPage: (req, res, next) => {
    const roomObjectId = req.params.id;
    // console.log("loggggginnniddddd", roomObjectId);

    if (req.session.loggedIn) {
      return res.redirect("/user/booking/" + roomObjectId);
    } else {
      res.render("user/login", {
        User: true,
        loginErr: req.session.loginErr,
        roomObjectId,
      });
      req.session.loginErr = false;
    }
  },

  login: async (req, res, next) => {
    const roomObjectId = req.params.id;

    try {
      const roomDetails = await userHelper.roomsDetails(roomObjectId);
      const hotelId = roomDetails.hotelId;

      userHelper.doLogin(req.body, hotelId).then((response) => {
        if (response.status) {
          req.session.loggedIn = true;
          req.session.user = response.user;
          // res.redirect("/booking/" + roomObjectId);
          res.render("user/booking", {
            loginMessage: "Login Success ",
            roomDetails: roomDetails, // Pass room details to the view
          });
        } else {
          // Set loginErr variable to true
          req.session.loginErr = true;
          res.redirect("/login/" + roomObjectId);
        }
      });
    } catch (error) {
      console.log(error);
      res.redirect("/login/" + roomObjectId);
    }
  },

  booking: (req, res) => {
    let id = req.params.id;
    // console.log("innnnnnnnnn",id);

    try {
      userHelper.roomsDetails(id).then((roomDetails) => {
        res.render("user/booking", { roomDetails });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching room details");
    }
  },

  bookingrooms: async (req, res) => {
    const roomId = req.params.id;

    try {
      if (req.session.loggedIn) {
        let userId = req.session.user.userId;

        const bookingData = req.body;
        await userHelper.roomsDetails(roomId).then((roomDetails) => {
          const hotelId = roomDetails.hotelId;
          const roomId = roomDetails.roomId;
          const roomDetailsid = roomDetails._id;

          userHelper
            .dobooking(bookingData, roomId, hotelId, userId)
            .then((bookingId) => {
              userHelper.price(bookingId).then((totalprice) => {
                // res.redirect(`/payment/${roomDetailsid}?value=${totalprice}`);
                // console.log("rooomdetailssss",roomDetails);
                res.render("user/payment", { roomDetails, totalprice });
              });
            });
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Error in booking");
    }
  },

  checkavailabilty: async (req, res, next) => {
    const roomdetailsid = req.params.id;
    const { checkin, checkout } = req.body;

    try {
      // Retrieve room details to get roomId
      const roomDetails = await userHelper.roomsDetails(roomdetailsid);
      const roomId = roomDetails.roomId;

      // Check if any existing booking overlaps with the provided date range
      const existingBooking = await userHelper.dochecking(
        checkin,
        checkout,
        roomId
      );

      if (existingBooking) {
        // Dates are not available or already booked, inform the user
        console.log("Selected dates are not available or already booked");
        res.render("user/room", {
          errorMessage: "Selected dates are not available ",
          roomDetails: roomDetails, // Pass room details to the view
        });
      } else {
        // Dates are available and not booked
        if (req.session.loggedIn) {
          // If user is logged in, redirect to booking route
          console.log("Dates are available for booking");

          //   res.render("user/booking", {
          //     loginMessage: "login success ",
          //     roomDetails: roomDetails // Pass room details to the view
          // });
          res.redirect("/booking/" + roomdetailsid);
        } else {
          // If user is not logged in, redirect to room route
          console.log("User is not logged in. Redirecting to room route.");
          res.redirect("/login/" + roomdetailsid);
        }
      }
    } catch (error) {
      console.log("Error checking availability:", error);
      res.redirect("/"); // Redirect to home page with an error message
    }
  },

  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/");
  },

  homepage: (req, res) => {
    userHelper.showhotels().then((hotelssdata) => {
      res.render("user/homePage", {
        hotelssdata,
      });
    });
  },

  allrooms: (req, res) => {
    let hotelId = req.params.id;
    // console.log("jjjjjjjjjj",hotelId);
    try {
      userHelper.showrooms(hotelId).then((roomsdata) => {
        // console.log("$$$$$$$$$$$$$$", roomsdata);
        res.render("user/allRooms", {
          roomsdata,
          hotelId,
        });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching rooms data");
    }
  },

  allfacilities: (req, res) => {
    const hotelId = req.params.id;

    //  console.log("pppppppppppppp",hotelId);

    try {
      userHelper.showfacilities(hotelId).then((facilitydata) => {
        res.render("user/facility", {
          facilitydata,
          hotelId,
        });
      });
    } catch (error) {}
  },

  room: (req, res) => {
    let id = req.params.id;
    try {
      userHelper.roomsDetails(id).then((roomDetails) => {
        res.render("user/room", { roomDetails });
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching room details");
    }
  },

  payment: async (req, res) => {
    // console.log("reqqqqqqqqqqqq.bodyyyyyyyyyyy", req.body);
    try {
      if (req.session.loggedIn) {
        const userId = req.session.user.userId;

        // console.log("^^^^^^^^^^^^^^^^^^6",userId);

        const { name, price, hotelId, roomId } = req.body;

        const paymentResult = await userHelper.payment(
          name,
          price,
          hotelId,
          roomId,
          userId
        );

        // Send response back to client
        res.status(200).send(paymentResult);
      }
    } catch (error) {
      console.log(error.message);
      // Handle error
      res.status(500).send({ success: false, msg: "Something went wrong!" });
    }
  },

  receipt: async (req, res) => {
    try {
      if (req.session.loggedIn) {
        const userId = req.session.user.userId;

        // Fetch user details and hotel details based on the user's ID
        const [userDetails, hotelDetails, customerDetails] =
          await userHelper.showreceipt(userId);

        // Render the receipt page with user and hotel details
        res.render("user/receipt", {
          userDetails,
          hotelDetails,
          customerDetails,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Error fetching receipt details");
    }
  },


  otploginpage: (req, res) => {
    res.render("user/otplogin");
  },



   successGoogleLogin : async (req, res) => {
    try {
      if (req.user) {
        // If user is authenticated
        const roomObjectId = req.params.id; // Assuming you have access to roomObjectId
        const roomDetails = await userHelper.roomsDetails(roomObjectId);
        
        // Render the booking page with login success message and room details
        res.render("user/booking", {
          loginMessage: "Login Success",
          roomDetails: roomDetails,
        });
      } else {
        // If user is not authenticated, redirect to failure page
        res.redirect("/login/" + roomDetails);
      }
    } catch (error) {
      console.error(error);
      // Handle error appropriately
      res.redirect("/failure");
    }
  },
  
   failureGoogleLogin : (req, res) => {
    res.send("Error");
  },
  



  
  userprofile: (req, res) => {
    try {
      if (req.session.loggedIn) {
        const userId = req.session.user.userId;

        // console.log("~~~~~~~~~~~~~~~~~``",userId);

        userHelper.userprofile(userId).then((userDetails) => {
          // console.log("uuuuuuuuuuuuu",userDetails);
          res.render("user/userprofile", {
            userDetails,
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  changeuserPasswordpage: (req, res) => {
    res.render("user/changepassword");
  },

  changeuserpassword: (req, res) => {
    try {
      if (req.session.loggedIn) {
        const userId = req.session.user.userId;

        // console.log("~~~~~~~~~~~~~~~~~``",userId);

        // console.log("!!!!!!!!!!!!!!1",req.body);

        userHelper.upadateUserPassword(req.body, userId).then((userDetails) => {
          console.log("uuuuuuuuuuuuu;;;;;;;;;;;", userDetails);
          res.redirect("/userprofile");
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  updateuserpage: (req, res) => {
    res.render("user/update");
  },

  updateuser: (req, res) => {
    try {
      if (req.session.loggedIn) {
        const userId = req.session.user.userId;

        console.log("reqqqqqqqqqqqqqqq", req.body);

        userHelper.upadateUserdetails(req.body, userId).then(() => {
          res.redirect("/userprofile");
        });
      }
    } catch (error) {
      console.log(error);
    }
  },




};
