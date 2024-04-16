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


  checkavailabilty: async (req, res) => {

    const roomId = req.params.id;
    console.log("Checking availability for room with ID:", roomId);

    console.log("########################### reqqq.bodyyyyy",req.body);
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
                    res.redirect("/booking/"+roomId); // Redirect to booking page after successful booking
                });
            } catch (error) {
                console.log("Error in booking:", error);
                res.redirect("/"); // Redirect to booking page with an error message
            }
        } else {
            // Dates are not available or already booked, inform the user
            console.log("Selected dates are not available or already booked");
            res.redirect("/room/"+roomId); // Redirect to home page or any other appropriate route
        }
    } catch (error) {
        console.log("Error checking availability:", error);
        res.redirect("/"); // Redirect to booking page with an error message
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
  

  bookingrooms: (req, res) => {
    let roomId = req.params.id; // Correctly retrieve room ID from request parameters

    try {
        userHelper.dobooking(req.body).then((result) => {
            console.log(result);
            // Render the payment page with the correct room ID
            res.redirect("/payment/" + roomId);
        });
    } catch (error) {
        console.log(error);
    }
},




paymentpage:(req,res)=>{

  let id = req.params.id;
  try {
       userHelper.roomsDetails(id).then((roomDetails)=>{
        res.render("user/payment", { roomDetails });
       });
  } catch (error) {
      console.error(error);
      res.status(500).send("Error fetching room details");
  }
},
 


payment: async (req, res) => {
  try {
    
      const { name, price } = req.body;

      const paymentResult = await userHelper.payment(name, price);

      // Send response back to client
      res.status(200).send(paymentResult);
  } catch (error) {
      console.log(error.message);
      // Handle error
      res.status(500).send({ success: false, msg: 'Something went wrong!' });
  }
}




}



