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
    userHelper.showrooms().then((roomsdata) => {
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
  }

  








}
