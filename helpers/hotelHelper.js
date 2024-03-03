var { connectToMongoDB } = require("../config/connection");
var collection = require("../config/collection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");

module.exports = {

    hoteldoSignup: (hotelsData) => {

        return new Promise(async (resolve, reject) => {
          console.log("!!!!!!!!!!!!!!!11hotelsssdataaaa",hotelsData);
    
          if (hotelsData.password === hotelsData.confirmpassword) {
            var encryptedpassword = await bcrypt.hash(hotelsData.password, 10);
            console.log(encryptedpassword);
          } else {
            console.log("error");
            throw new Error("given passwords are not same");
          }
  
          let hotelsignupData = {
            // name: hotelsData.name,
            email: hotelsData.email,
            password: encryptedpassword,
            blocked: false,
            vote: false,
            usercount:0,
          };

          const db = await connectToMongoDB();
          
          await db
            .collection(collection.HOTEL_COLLECTION)
            .insertOne(hotelsignupData)
            .then((data) => {
              resolve(data.insertedId);
            });
        });
      },

      hotelLogin: (hotelloginData) => {
        // console.log("logindataaaaaaaaaaaaaaaaaa",loginData);
        
        return new Promise(async (resolve, reject) => {
          let loginstatus = false;
          let response = {};
          const db = await connectToMongoDB();
          let user = await db
            .collection(collection.HOTEL_COLLECTION)
            .findOne({ email: hotelloginData.email });
    
          if (user) {
            bcrypt.compare(hotelloginData.password, user.password).then((status) => {
              if (status) {
                // console.log("login success");
                response.user = user;
                response.status = true;
                resolve(response);
              } else {
                resolve({ status: false });
              }
            });
          } else {
            resolve({ status: false });
          }
        });
      },



    
}