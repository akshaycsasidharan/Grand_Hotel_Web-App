var { connectToMongoDB } = require("../config/connection");
var collection = require("../config/collection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: "rzp_test_8cTRaG2qyqmSGG",
  key_secret: "lPhtD4Guxq3dUurYJLs9OwXi",
});

module.exports = {
  doSignup: (userData, hotelId, roomId) => {
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
        userId: Date.now().toString(16),
        hotelId: hotelId,
        roomId: roomId,
        name: userData.name,
        email: userData.email,
        password: encryptedpassword,
        mobilenumber: userData.mobilenumber,
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

  doLogin: (loginData, hotelId) => {
    return new Promise(async (resolve, reject) => {
      let loginstatus = false;
      let response = {};
      const db = await connectToMongoDB();
      let user = await db
        .collection(collection.USER_COLLECTION)
        .findOne({ email: loginData.email, hotelId: hotelId });

      if (user) {
        bcrypt.compare(loginData.password, user.password).then((status) => {
          if (status) {
            console.log("login success");
            // const usertoken = jwt.sign(
            //   { userId: user._id, useremail: user.email },
            //   "secret",
            //   { expiresIn: "24h" }
            // );
            // response.token = usertoken;
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
        .find({ hotelId: hotelId, deleted: false })
        .toArray();
      return hotelrooms;
    } catch (error) {
      console.error("Error fetching hotel rooms:", error);
      throw error; // Propagate the error to the caller
    }
  },

  // doOtpLogin: (userData) => {
  //   return new Promise(async (resolve, reject) => {
  //     var response = {};
  //     console.log("*********userData Helper**********");
  //     console.log(userData);
  //     const db = await connectToMongoDB();
  //     const user = await db
  //       .collection(collection.USER_COLLECTION)
  //       .findOne({ mobilenumber: userData });
  //     console.log(user);
  //     if (user) {
  //       console.log("----------otp login successful");
  //       response.user = user;
  //       response.acessStatus = true;
  //       resolve(response);
  //     } else {
  //       console.log("otp login failed");
  //       response.user = "";
  //       response.acessStatus = false;
  //       resolve(response);
  //     }
  //   });
  // },

  showfacilities: async (hotelid) => {
    console.log("kkkkkkkkkk", hotelid);
    try {
      const db = await connectToMongoDB();
      const hotelfacilities = await db
        .collection(collection.FACILITY_COLLECTION)
        .find({ hotelId: hotelid, facility: false })
        .toArray();
      return hotelfacilities;
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

  dobooking: (bookingdata, roomId, hotelId, userId) => {
    return new Promise(async (resolve, reject) => {
      // Extract check-in and checkout dates from the booking data
      const { checkin, checkout } = bookingdata;

      // Construct the array of dates between check-in and checkout dates
      const datesInRange = [];
      let currentDate = new Date(checkin);
      const checkoutDate = new Date(checkout);
      while (currentDate <= checkoutDate) {
        datesInRange.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }

      // Construct the booking object with the array of dates
      let bookingObject = {
        userId: userId,
        roomId: roomId,
        hotelId: hotelId,
        name: bookingdata.name,
        email: bookingdata.email,
        dates: datesInRange, // Store the array of dates
      };

      try {
        const db = await connectToMongoDB();
        // Insert the booking object into the database
        const result = await db
          .collection(collection.BOOKING_COLLECTION)
          .insertOne(bookingObject);
        // Resolve with the inserted ID
        resolve(result.insertedId);
      } catch (error) {
        console.error("Error in booking:", error);
        reject(error);
      }
    });
  },

  price: async (bookingId) => {
    // console.log("priceeeeeeeeeeid", bookingId);
    const db = await connectToMongoDB();
    const bookingprice = await db
      .collection(collection.BOOKING_COLLECTION)
      .find(bookingId)
      .toArray();
    // console.log("boooooooookinggpriceee@22222222", bookingprice);
    // console.log("bookingprice....", bookingprice[0].roomId);
    // console.log("arrayy", bookingprice[0].dates.length);
    const id = bookingprice[0].roomId;
    const roomprice = await db
      .collection(collection.ROOMS_COLLECTION)
      .find({ roomId: id })
      .toArray();
    // console.log("$$$$$$$$$4", roomprice);

    const totalprice = roomprice[0].Price * bookingprice[0].dates.length;
    //  console.log("totalpriceee," ,totalprice);
    return totalprice;
  },

  dochecking: async (checkin, checkout, roomId) => {
    try {
      const db = await connectToMongoDB();

      // Convert check-in and checkout dates to Date objects
      const checkinDate = new Date(checkin);
      const checkoutDate = new Date(checkout);

      // Ensure check-in date is before or equal to check-out date
      if (checkinDate > checkoutDate) {
        throw new Error("Check-in date cannot be later than check-out date");
      }

      // Construct the array of dates between check-in and checkout dates
      const datesInRange = [];
      let currentDate = new Date(checkinDate);
      while (currentDate <= checkoutDate) {
        datesInRange.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }

      // Query the booking collection to check if any booking overlaps with the provided date range and roomId
      const existingBooking = await db
        .collection(collection.BOOKING_COLLECTION)
        .findOne({
          roomId: roomId, // Match the roomId
          $or: [
            { dates: { $in: datesInRange } }, // Check if any date falls within the provided date range
            {
              $and: [
                { checkin: { $lte: checkinDate } },
                { checkout: { $gte: checkoutDate } },
              ],
            }, // Existing booking spans the provided date range
            {
              $and: [
                { checkin: { $gte: checkinDate } },
                { checkout: { $lte: checkoutDate } },
              ],
            }, // Existing booking falls within the given date range
          ],
        });

      // Return the booking data if exists, otherwise return null
      return existingBooking;
    } catch (error) {
      throw error;
    }
  },

  payment: async (name, price, hotelId, roomId, userId) => {
    try {
      const options = {
        amount: price * 100, // Amount should be in smallest currency unit (paisa for INR)
        currency: "INR",
        receipt: `razorUser_${userId}`, // Use userId in receipt for better tracking
        payment_capture: 1, // Auto capture the payment when successful
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
        roomId: roomId,
        hotelId: hotelId,
        userId: userId,
        status: "success", // Initially set status to 'pending'
        payment_date: new Date(), // Store the current date as payment date
      };

      // Connect to MongoDB
      const db = await connectToMongoDB();

      // Insert payment details into MongoDB payment collection
      await db
        .collection(collection.PAYMENT_COLLECTION)
        .insertOne(paymentDetails);

      // Return order details
      return {
        success: true,
        msg: "Order Created",
        order_id: order.id,
        amount: options.amount,
        key_id: "rzp_test_8cTRaG2qyqmSGG",
        product_name: name,
      };
    } catch (error) {
      console.log(error.message);
      throw error;
    }
  },

  userprofile: async (userId) => {
    try {
      const db = await connectToMongoDB();
      const userDetails = await db
        .collection(collection.USER_COLLECTION)
        .findOne({ userId: userId });
      return userDetails;
    } catch (error) {
      throw error;
    }
  },

  upadateUserPassword: async (userdata, userId) => {
    try {
      const db = await connectToMongoDB();
      const user = await db
        .collection(collection.USER_COLLECTION)
        .findOne({ userId: userId });

      if (user) {
        // Hash the new password
        userdata.newpassword = await bcrypt.hash(userdata.newpassword, 10);

        // Update the password in the database
        const data = await db.collection(collection.USER_COLLECTION).updateOne(
          { userId: userId }, // Use userId directly if it's already an ObjectId
          {
            $set: { password: userdata.newpassword },
          }
        );
        
        console.log(data);
        return data;
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      throw error;
    }
  },

  upadateUserdetails: async (userdata, userId) => {
    try {
      const db = await connectToMongoDB();
      // Update the user details in the database
      const userDetails = await db
        .collection(collection.USER_COLLECTION)
        .findOne({ userId: userId })
        .updateOne({
          $set: {
            name: userdata.name,
            email: userdata.email,
            mobilenumber: userdata.mobile,
          },
        });
      return userDetails;
    } catch (error) {
      throw error;
    }
  },

  showreceipt: async (userId) => {
    // console.log("$$$$$$$$$$$$$$$4",userId);

    try {
      const db = await connectToMongoDB();

      // Fetch user details based on the user's ID
      const userDetails = await db
        .collection(collection.PAYMENT_COLLECTION)
        .findOne({ userId: userId });

      const hotelDetails = await db
        .collection(collection.HOTEL_COLLECTION)
        .findOne({ hotelId: userDetails.hotelId });

      const customerDetails = await db
        .collection(collection.BOOKING_COLLECTION)
        .findOne({ userId: userId });

      // console.log("2222222222222222222userdetails",userDetails);
      // console.log("1111111111111111111hoteldetails",hotelDetails);
      // console.log(("333333333333333333customerdetailss",customerDetails));

      return [userDetails, hotelDetails, customerDetails];
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
