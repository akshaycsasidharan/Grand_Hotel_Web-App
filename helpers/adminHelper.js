require("dotenv").config();
var { connectToMongoDB } = require("../config/connection");
const collection = require("../config/collection");
const { ObjectId } = require("mongodb");
// const { response } = require("../app");

module.exports = {

  doAdminLogin: (admindata) => {
    let adminPassword = process.env.PASSWORD;
    let adminEmail = process.env.EMAIL;

    return new Promise((resolve, reject) => {
      if (
        admindata.email == adminEmail &&
        admindata.password == adminPassword
      ) {
        resolve(true);
      } else {
        reject("Invalid credentials");
      }
    });
  },

  getHotelsData: async () => {
    try {
      const db = await connectToMongoDB();
      const hotelsData = await db
        .collection(collection.HOTEL_COLLECTION)
        .find({})
        .toArray();

      return hotelsData;
    } catch (error) {
      throw error;
    }
  },


  blockUser: (userid) => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();

      await db
        .collection(collection.HOTEL_COLLECTION)
        .updateOne(
          { _id: new ObjectId(userid) },
          {
            $set: {
              blocked: true,
            },
          }
        )
        .then((result) => {
          if (result.matchedCount > 0) {
            resolve();
          } else {
            reject(new Error("User not found or not updated"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },


  unblockUser: (userid) => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();

      await db
        .collection(collection.HOTEL_COLLECTION)
        .updateOne(
          { _id: new ObjectId(userid) },
          {
            $set: { blocked: false },
          }
        )
        .then((result) => {
          if (result.matchedCount > 0) {
            resolve();
          } else {
            reject(new Error("User not found or not updated"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },


  getcutomerdata: async () => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      let customerdata = await db
        .collection(collection.USER_COLLECTION)
        .find({blocked:false})
        .toArray();
      resolve(customerdata);
    });
  },



  transactiondetails:() => {
    
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
    let transactionview = db.collection(collection.PAYMENT_COLLECTION)
        .find({})
        .toArray();
        resolve(transactionview)
    });
  },

  transactiondetails:() =>{
return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
    let transactionview = db.collection(collection.PAYMENT_COLLECTION)
        .find({})
        .toArray();
        resolve(transactionview)
    });


  },




  showhoteldashboard: () => {

    return new Promise(async (resolve, reject) => {
      try {
        const db = await connectToMongoDB();

        const hotels = await db
          .collection(collection.HOTEL_COLLECTION)
          .countDocuments({ });
        const customerscount = await db
          .collection(collection.USER_COLLECTION)
          .countDocuments({  });
        const bookingCount = await db
          .collection(collection.BOOKING_COLLECTION)
          .countDocuments({ });
        const roomsCount = await db
          .collection(collection.ROOMS_COLLECTION)
          .countDocuments({ });
          const facilitiescount = await db
          .collection(collection.FACILITY_COLLECTION)
          .countDocuments({ });
          const paymentcount = await db
          .collection(collection.PAYMENT_COLLECTION)
          .countDocuments({ });
          
        resolve({
          paymentcount,
          facilitiescount,
          roomsCount,
          bookingCount,
          hotels,
          customerscount,
          roomsCount,
        });
      } catch (error) {
        reject(error);
      }
    });
  },


  


};
