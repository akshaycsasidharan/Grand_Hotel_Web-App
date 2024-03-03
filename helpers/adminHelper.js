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
  }
  
}