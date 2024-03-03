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
        resolve();
      }
    })
  },

  getHotelsData: () => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      let getdata = await db
        .collection(collection.USER_COLLECTION)
        .find({})
        .toArray();
      resolve(getdata);
    });
  },  
}