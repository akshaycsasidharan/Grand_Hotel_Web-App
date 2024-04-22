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


  booking:(req,res) =>{
    let id = req.params.id;
    
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



// checkavailabilty: async (req, res) => {

//   const roomId = req.params.id;
//   const { checkin, checkout } = req.body;

//   try {
//       // Check if any existing booking overlaps with the provided date range
//       const existingBooking = await userHelper.dochecking(checkin, checkout);

//       if (!existingBooking) {
//           // Dates are available and not booked, proceed with booking
//           console.log("Dates are available for booking");
//           res.redirect("/booking/" + roomId);
//       } else {
//           // Dates are not available or already booked, inform the user
//           console.log("Selected dates are not available or already booked");
//           res.redirect("/room/" + roomId);
//       }
//   } catch (error) {
//       console.log("Error checking availability:", error);
//       res.redirect("/"); // Redirect to home page with an error message
//   }
// },


checkavailabilty: async (req, res) => {

  const roomId = req.params.id;
  console.log("________________________________________",roomId);
    
  console.log("Checking availability for dates:", req.body);

  try {
      const result = await userHelper.dochecking(req.body);

      // Check if availability data is stored in the BOOKING_COLLECTION
      const db = await connectToMongoDB();
      const bookingData = await db.collection(collection.BOOKING_COLLECTION).findOne(req.body);

      if (result && !bookingData) {
          // Dates are available and not booked, proceed with booking
          console.log("Dates are available for booking");
          try {
              // Perform the booking
              userHelper.dobooking(req.body).then((bookingResult) => {
                  console.log("Booking successful:", bookingResult);
                  // Redirect to booking route with the roomid
                  res.redirect("/booking/" + roomId);
              });
          } catch (error) {
              console.log("Error in booking:", error);
              res.redirect("/"); // Redirect to home page with an error message
          }
      } else {
          // Dates are not available or already booked, inform the user
          console.log("Selected dates are not available or already booked");
          res.redirect("/room/" + roomId); // Redirect to room page or any other appropriate route
      }
  } catch (error) {
      console.log("Error checking availability:", error);
      res.redirect("/"); // Redirect to home page with an error message
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

  console.log("reqqqqqqqqqqqq.bodyyyyyyyyyyy",req.body);
  try {
      const { name, price,hotelId,roomId} = req.body;

      const paymentResult = await userHelper.payment(name, price,hotelId,roomId);

      // Send response back to client
      res.status(200).send(paymentResult);
  } catch (error) {
      console.log(error.message);
      // Handle error
      res.status(500).send({ success: false, msg: 'Something went wrong!' });
  }
},



}



