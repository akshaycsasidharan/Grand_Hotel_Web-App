const { CURSOR_FLAGS } = require("mongodb");
const userHelper = require("../helpers/userHelper");
const { render } = require("../app");
const multer = require("multer");
const Razorpay = require("razorpay");
var { connectToMongoDB } = require("../config/connection");
const { ObjectId } = require("mongodb");
var collection = require("../config/collection");


// const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_8cTRaG2qyqmSGG",
  key_secret: "lPhtD4Guxq3dUurYJLs9OwXi"
});



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

    const roomObjectId = req.params.id;
    // console.log("loggggginnniddddd", roomObjectId);
    
    if (req.session.loggedIn) {
        return res.redirect("/user/booking/" + roomObjectId);
    } else {
        res.render("user/login", { roomObjectId });
    } 
},


login: (req, res, next) => {

  const roomObjectId = req.params.id;
  // console.log("**********************",roomObjectId);

    try {
        userHelper.doLogin(req.body).then((response) => {
            if (response.status) {
                req.session.loggedIn = true;
                req.session.user = response.user;
                // const userId = response.user.userId;

                // Redirect to the booking route with userId and roomObjectId
                res.redirect("/booking/" + roomObjectId);
            } else {
                req.session.loginErr = true;
                res.render("user/login", { error: response.message });
            }
        });
    } catch (error) {
        console.log(error);
    }
},


booking:(req,res) =>{
  let id = req.params.id;
  // console.log("innnnnnnnnn",id);
  
  try {
       userHelper.roomsDetails(id).then((roomDetails)=>{
        res.render("user/booking", { roomDetails });
       });
  } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching room details");
  }
},



// booking:(req,res) => {
//   res.render("user/booking");
// },



bookingrooms: (req, res) => {

const roomId = req.params.id;

  try {
      const bookingData = req.body;
      userHelper.roomsDetails(roomId).then((roomDetails) => {

          const hotelId = roomDetails.hotelId; 
          const roomId = roomDetails.roomId; 
          const roomDetailsid = roomDetails._id;

          // console.log("roomDetailsid!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1",roomDetailsid);
          // console.log("roommiddroroooommmiddd", roomId);
          // console.log("hotelidddddddddd", hotelId);

          userHelper.dobooking(bookingData, roomId, hotelId).then((bookingId) => {
              console.log("Booking ID:", bookingId);
              // Redirect to the payment page with the correct bookingId
              res.redirect("/payment/" +roomDetailsid );
          });
      });
  } catch (error) {
      console.log(error);
      // Handle error
      res.status(500).send("Error in booking");
  }
},



checkavailabilty: async (req, res,next) => {
  
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
      res.redirect("/room/" + roomdetailsid);
    } else {
      // Dates are available and not booked
      if (req.session.loggedIn) {
        let userId = req.session.user.userId;
        // If user is logged in, redirect to booking route
        console.log("Dates are available for booking");
        res.redirect("/booking/"  + roomdetailsid );
      } else {
        // If user is not logged in, redirect to room route
        console.log("User is not logged in. Redirecting to room route.");
        res.redirect("/login/"+roomdetailsid);
      }
    }
  } catch (error) {
    console.log("Error checking availability:", error);
    res.redirect("/"); // Redirect to home page with an error message
  }
},



logout:(req,res) => {
  req.session.destroy();
  res.redirect("/");
},


  homepage:(req,res) => {
    userHelper.showhotels().then((hotelssdata) => {
      res.render("user/homePage",{
        hotelssdata,
      });
    })
  },


  allrooms: (req, res) => {
    let hotelId = req.params.id; // Fetch the hotelId from route parameters
    try {
        userHelper.showrooms(hotelId).then((roomsdata) => {
            console.log("$$$$$$$$$$$$$$", roomsdata);
            res.render("user/allRooms", {
                roomsdata
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching rooms data");
    }
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
  },


paymentpage:(req,res)=>{

  let id = req.params.id;
  try {
       userHelper.roomsDetails(id).then((roomDetails)=>{
        // console.log("rooooomdetailsssss&&&&&&&&&&&&&",roomDetails);
        res.render("user/payment", { roomDetails });
       });
  } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching room details");
  }

},
 


payment: async (req, res) => {

  // console.log("reqqqqqqqqqqqq.bodyyyyyyyyyyy",req.body);
  try {

    if(req.session.loggedIn){

      const userId = req.session.user.userId;

      console.log("^^^^^^^^^^^^^^^^^^6",userId);

      const { name, price,hotelId,roomId} = req.body;

      const paymentResult = await userHelper.payment(name, price,hotelId,roomId,userId);

      // Send response back to client
      res.status(200).send(paymentResult);
    }

  } catch (error) {
      console.log(error.message);
      // Handle error
      res.status(500).send({ success: false, msg: 'Something went wrong!' });
  }
},



}



