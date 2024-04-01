var { connectToMongoDB } = require("../config/connection");
var collection = require("../config/collection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

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

  showrooms: async () => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();

      let hotelroom = await db
        .collection(collection.HOTEL_COLLECTION)
        .find({ deleted: false })
        .toArray();
      resolve(hotelroom);
    });
  },

  roomsDetails: async (roomid) => {
    try {
      const db = await connectToMongoDB();
      const roomDetails = await db
        .collection(collection.HOTEL_COLLECTION)
        .findOne({ _id: new ObjectId(roomid) });
      return roomDetails;
    } catch (error) {
      throw error;
    }
  },


  dobooking: (bookingdata) => {
    return new Promise(async (resolve, reject) => {
      let datasbooking = {
        name: bookingdata.name,
        email: bookingdata.email,
        checkin: bookingdata.checkin,
        checkout: bookingdata.checkout,
        booked: true,
      };

      const db = await connectToMongoDB();

      await db
        .collection(collection.USER_COLLECTION)
        .insertOne(datasbooking)
        .then((data) => {
          resolve(data.insertedId);
        });
    });
  },


  // paymentDetails:async (paymentid) => {
  //   try {
  //     const db = await connectToMongoDB();
  //     const paymentDetails = await db
  //       .collection(collection.HOTEL_COLLECTION)
  //       .findOne({ _id: new ObjectId(paymentid) });
  //     return paymentDetails;
  //   } catch (error) {
  //     throw error;
  //   }
  // },



};
