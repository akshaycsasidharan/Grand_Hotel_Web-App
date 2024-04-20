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
    const { checkin, checkout } = req.body;

    try {
        const bookingData = await userHelper.dochecking(checkin, checkout);

        if (!bookingData) {
            // Dates are available and not booked, proceed with booking
            console.log("Dates are available for booking");
            try {
                // Redirect to booking page after successful booking
                res.redirect("/booking/" + roomId);
            } catch (error) {
                console.log("Error in redirecting to booking page:", error);
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
        console.log("rooooomdetailsssss&&&&&&&&&&&&&",roomDetails);
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



