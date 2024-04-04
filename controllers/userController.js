const { CURSOR_FLAGS } = require("mongodb");
const userHelper = require("../helpers/userHelper");
const { render } = require("../app");
const multer = require("multer");
const Razorpay = require("razorpay");

const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY
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

  allrooms:(req,res) => {
    let id = req.params.id;
    console.log("#####333hoteid",id);
    userHelper.showrooms(id).then((roomsdata) => {
      console.log("$$$$$$$$$$$$$$",roomsdata);
      res.render("user/allRooms",{
        roomsdata
      });
    })

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
    res.render("user/booking");
  },
  
  bookingrooms:(req,res) => {
  try {
    userHelper.dobooking(req.body).then((result) => {
      console.log(result);
      res.redirect("/booking");
    });
  } catch (error) {
    console.log(error);
  }
  
  },


 
//   checkavailabilty: async (req, res) => {
//     console.log("Checking availability for dates:", req.body);

//     try {
//         const result = await userHelper.dochecking(req.body);

//         // Check if availability data is stored in the BOOKING_COLLECTION
//         const db = await connectToMongoDB();
//         const bookingData = await db.collection(collection.BOOKING_COLLECTION).findOne(req.body);

//         if (result && !bookingData) {
//             // Dates are available and not booked, proceed with booking
//             console.log("Dates are available for booking");
//             try {
//                 // Perform the booking
//                 userHelper.dobooking(req.body).then((bookingResult) => {
//                     console.log("Booking successful:", bookingResult);
//                     res.redirect("/booking"); // Redirect to booking page after successful booking
//                 });
//             } catch (error) {
//                 console.log("Error in booking:", error);
//                 res.redirect("/booking"); // Redirect to booking page with an error message
//             }
//         } else {
//             // Dates are not available or already booked, inform the user
//             console.log("Selected dates are not available or already booked");
//             res.redirect("/"); // Redirect to home page or any other appropriate route
//         }
//     } catch (error) {
//         console.log("Error checking availability:", error);
//         res.redirect("/booking"); // Redirect to booking page with an error message
//     }
// },


checkavailabilty: async (req, res) => {
  console.log("Checking availability for dates:", req.body);

  try {
    // Check if availability data is stored in the BOOKING_COLLECTION
    const db = await connectToMongoDB();
    const bookingData = await db.collection(collection.BOOKING_COLLECTION).findOne(req.body);

    if (!bookingData) {
      // No booking data found, proceed with availability check
      console.log("No booking data found, proceeding with availability check");
      const result = await userHelper.dochecking(req.body);
      
      if (result) {
        // Dates are available, proceed with booking
        console.log("Dates are available for booking");
        await userHelper.dobooking(req.body); // Perform the booking

        res.redirect("/booking"); // Redirect to payment page after successful booking
        return;
      } else {
        // Dates are not available, inform the user
        console.log("Selected dates are not available");
        res.redirect("/rooms"); // Redirect to all rooms page or any other appropriate route
        return;
      }
    } else {
      // Dates are already booked, inform the user
      console.log("Selected dates are already booked");
      res.redirect("/"); // Redirect to payment page or any other appropriate route
      return;
    }
  } catch (error) {
    console.log("Error occurred while checking availability:", error);
    res.redirect("/allrooms"); // Redirect to all rooms page or any other appropriate route with an error message
    return;
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
  

   payment : async (req, res) => {
    try {
      const amount = req.body.price * 100; // Correct variable name
      const options = {
        amount: amount, // Correct variable name
        currency: 'INR',
        receipt: 'razorUser@gmail.com'
      };
  
      razorpayInstance.orders.create(options, (err, order) => {
        if (!err) {
          res.status(200).send({
            success: true,
            msg: 'Order Created',
            order_id: order.id,
            amount: amount, // Correct variable name
            key_id: RAZORPAY_ID_KEY,
            product_name: req.body.name,
          });
        } else {
          res.status(400).send({ success: false, msg: 'Something went wrong!' });
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  },


  








}
