var { connectToMongoDB } = require("../config/connection");
var collection = require("../config/collection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");


const razorpayInstance = new Razorpay({
  key_id: "rzp_test_8cTRaG2qyqmSGG",
  key_secret: "lPhtD4Guxq3dUurYJLs9OwXi"
});


module.exports = {


  doSignup: (userData) => {
    return new Promise(async (resolve, reject) => {
      //   console.log(userData);

      if (userData.password === userData.confirmpassword) {
        var encryptedpassword = await bcrypt.hash(userData.password, 10);
        // console.log(encryptedpassword);
      } else {
        console.log("error");
        throw new Error("given passwords are not same");
      }

      let signupData = {


        userId:Date.now().toString(16),


        name: userData.name,
        email: userData.email,
        password: encryptedpassword,
        blocked: false,
      };

      const db = await connectToMongoDB();

      await db
        .collection(collection.USER_COLLECTION)
        .insertOne(signupData)
        .then((data) => {
          resolve(data.insertedId);
        });
    });
  },


  doLogin: (loginData) => {
    return new Promise(async (resolve, reject) => {
      let loginstatus = false;
      let response = {};
      const db = await connectToMongoDB();
      let user = await db
        .collection(collection.USER_COLLECTION)
        .findOne({ email: loginData.email });

      if (user) {
        bcrypt.compare(loginData.password, user.password).then((status) => {
          if (status) {
            console.log("login success");
            const usertoken = jwt.sign(
              { userId: user._id, useremail: user.email },
              "secret",
              { expiresIn: "24h" }
            );
            response.token = usertoken;
            response.user = user;
            response.status = true;
            response.message = "Login Success";
            resolve(response);
          } else {
            response.message = "the user cant login";
            resolve({ status: false });
          }
        });
      } else {
        resolve({ status: false });
      }
    });
  },


  showhotels: async () => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();

      let Datahotel = await db
        .collection(collection.HOTEL_COLLECTION)
        .find({ blocked: false })
        .toArray();
      resolve(Datahotel);
    });
  },


  showrooms: async (hotelId) => {
    try {
        const db = await connectToMongoDB();
        const hotelrooms = await db
            .collection(collection.ROOMS_COLLECTION)
            .find({ hotelId: hotelId })
            .toArray();
        return hotelrooms;
    } catch (error) {
        console.error("Error fetching hotel rooms:", error);
        throw error; // Propagate the error to the caller
    }
},


  roomsDetails: async (roomid) => {
    try {
      const db = await connectToMongoDB();
      const roomDetails = await db
        .collection(collection.ROOMS_COLLECTION)
        .findOne({ _id: new ObjectId(roomid) });
      return roomDetails;
    } catch (error) {
      throw error;
    }
  },


  dobooking: (bookingdata, roomId, hotelId) => {
    
    return new Promise(async (resolve, reject) => {
        // Construct the booking object
        let bookingObject = {
            roomId: roomId,
            hotelId: hotelId,
            name: bookingdata.name,
            email: bookingdata.email,
            checkin: bookingdata.checkin,
            checkout: bookingdata.checkout,
            booked: false
        };

        try {
            const db = await connectToMongoDB();
            // Insert the booking object into the database
            const result = await db.collection(collection.BOOKING_COLLECTION).insertOne(bookingObject);
            // Resolve with the inserted ID
            resolve(result.insertedId);
        } catch (error) {
            console.error("Error in booking:", error);
            reject(error);
        }
    });
},


//   dochecking: (checkingdata) => {

//     return new Promise(async (resolve, reject) => {
//         try {
//             const db = await connectToMongoDB();
//             const checkin = new Date(checkingdata.checkin);
//             const checkout = new Date(checkingdata.checkout);

//             // Ensure check-in date is before or equal to check-out date
//             if (checkin > checkout) {
//                 reject(new Error("Check-in date cannot be later than check-out date"));
//                 return;
//             }

//             // Generate an array of dates between check-in and check-out dates
//             const datesInRange = [];
//             for (let date = checkin; date <= checkout; date.setDate(date.getDate() + 1)) {
//                 datesInRange.push(new Date(date));
//             }

            
//             // Insert the array of dates into a single document in the database
//             const result = await db.collection(collection.CHECKING_COLLECTION).insertOne({
//                 dates: datesInRange
//             });

//             resolve(result.insertedId);
//         } catch (error) {
//             console.error("Error inserting checking data:", error);
//             reject(error);
//         }
//     });
// },




dochecking: async (checkin, checkout,roomId) => {

  console.log("3#######%%%%%%%%%",checkin,checkout);
  
  try {
      const db = await connectToMongoDB();
      
      // Query the booking collection to check if any booking exists for the given date range
      const existingBooking = await db.collection(collection.BOOKING_COLLECTION).findOne({
          // $or: [
          //     { $and: [{ checkin: { $lte: new Date(checkin) } }, { checkout: { $gte: new Date(checkin) } }] }, // Check-in date falls within existing booking
          //     { $and: [{ checkin: { $lte: new Date(checkout) } }, { checkout: { $gte: new Date(checkout) } }] }, // Check-out date falls within existing booking
          //     { $and: [{ checkin: { $gte: new Date(checkin) } }, { checkout: { $lte: new Date(checkout) } }] } // Existing booking falls within the given date range
          // ]
          checkin,checkout,roomId:roomId
      });

      // Return the booking data if exists, otherwise return null
      return existingBooking;
  } catch (error) {
      throw error;
  }
},


payment: async (name, price) => {
  
  try {
      // Create options object for Razorpay order
      const options = {
          amount: price * 100, // Amount should be in smallest currency unit (paisa for INR)
          currency: 'INR',
          receipt: 'razorUser@gmail.com',
          payment_capture: '1' // Automatically capture payments
      };

      // Create Razorpay order
      const order = await new Promise((resolve, reject) => {
          razorpayInstance.orders.create(options, (err, order) => {
              if (err) {
                  reject(err);
              } else {
                  resolve(order);
              }
          });
      });

      // If order creation is successful, save payment details to MongoDB
      const paymentDetails = {
          name: name,
          amount: price,
          order_id: order.id,
          status: 'success' // Initial status
      };

      // Connect to MongoDB
      const db = await connectToMongoDB();

      // Insert payment details into MongoDB payment collection
      await db.collection(collection.PAYMENT_COLLECTION).insertOne(paymentDetails);

      // Return order details
      return {
          success: true,
          msg: 'Order Created',
          order_id: order.id,
          amount: options.amount,
          key_id: "rzp_test_8cTRaG2qyqmSGG",
          product_name: name
      };
  } catch (error) {
      console.log(error.message);
      throw error;
  }
}



};
