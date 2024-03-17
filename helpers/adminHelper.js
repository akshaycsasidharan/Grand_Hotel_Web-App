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
        .find({blocked:false})
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
        .find({})
        .toArray();
      resolve(customerdata);
    });
  },


  


};
