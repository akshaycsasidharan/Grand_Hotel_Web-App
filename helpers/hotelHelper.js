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
            name: hotelsData.name,
            email: hotelsData.email,
            password: encryptedpassword,
            blocked: true,
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

      hotelLogin: async (hotelloginData) => {
        try {
          const db = await connectToMongoDB();
          const user = await db
            .collection(collection.HOTEL_COLLECTION)
            .findOne({ email: hotelloginData.email });
      
          if (user) {
            const status = await bcrypt.compare(hotelloginData.password, user.password);
            if (status) {
              return { user, status: true };
            }
          }
          return { status: false };
        } catch (error) {
          throw error;
        }
      },

      showcustomers:async() => {

        return new Promise(async (resolve, reject) => {
          const db = await connectToMongoDB();
          let customerdata = await db
            .collection(collection.USER_COLLECTION)
            .find({})
            .toArray();
          resolve(customerdata);
        });  
}
}