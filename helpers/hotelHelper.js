require("dotenv").config();
var { connectToMongoDB } = require("../config/connection");
var collection = require("../config/collection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { facility } = require("../controllers/hotelController");
const { response } = require("express");

module.exports = {
  hoteldoSignup: (hotelsData, file) => {
    return new Promise(async (resolve, reject) => {
      console.log("!!!!!!!!!!!!!!!11hotelsssdataaaa", hotelsData);

      if (hotelsData.password === hotelsData.confirmpassword) {
        var encryptedpassword = await bcrypt.hash(hotelsData.password, 10);
        console.log(encryptedpassword);
      } else {
        console.log("error");
        throw new Error("given passwords are not same");
      }

      let hotelsignupData = {
        hotelId: Date.now().toString(16),

        name: hotelsData.name,
        email: hotelsData.email,
        password: encryptedpassword,
        Image: file.filename,
        blocked: true,
        usercount: 0,
        mobilenumber: hotelsData.mobilenumber,
        Place: hotelsData.Place,
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

  hotelLogin: (loginData) => {
    return new Promise(async (resolve, reject) => {
      let loginstatus = false;
      let response = {};
      const db = await connectToMongoDB();
      let hotel = await db
        .collection(collection.HOTEL_COLLECTION)
        .findOne({ email: loginData.email });

      if (hotel) {
        bcrypt.compare(loginData.password, hotel.password).then((status) => {
          if (status) {
            console.log("login success");

            response.hotel = hotel;
            response.status = true;
            response.message = "Login Success";
            resolve(response);
          } else {
            // console.log("user not availableeee %%%%%%%%%%5%%%55");
            response.message = "the user cant login";
            resolve({ status: false });
          }
        });
      } else {
        resolve({ status: false });
      }
    });
  },

  showcustomers: async (hotel) => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      let customerdata = await db
        .collection(collection.BOOKING_COLLECTION)
        .find({ hotelId: hotel.hotelId })
        .toArray();
      resolve(customerdata);
    });
  },

  addrooms: (roomdata, file, hotel) => {
    return new Promise(async (resolve, reject) => {
      let dataroom = {
        roomId: Date.now().toString(16),

        hotelId:hotel.hotelId,
        Roomnumber: roomdata.Roomnumber,
        RoomType: roomdata.RoomType,
        Floor: roomdata.Floor,
        Price: roomdata.Price,
        Capacity: roomdata.Capacity,
        Image: file.filename,
        deleted: false,
      };

      const db = await connectToMongoDB();

      db.collection(collection.ROOMS_COLLECTION)
        .insertOne(dataroom)
        .then((data) => {
          resolve(data.insertedId);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  viewrooms: (hotel) => {
    console.log("=========hotellll",hotel);
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      let roomsview = db
        .collection(collection.ROOMS_COLLECTION)
        .find({ deleted: false,hotelId: hotel.hotelId })
        .toArray();
      resolve(roomsview);
    });
  },

  addfacility: (facilitiesdata, file,hotel) => {
    return new Promise(async (resolve, reject) => {
      let datafacilities = {

        hotelId:hotel.hotelId,
        Facilities: facilitiesdata.Facilities,
        Image: file.filename,
        facility: false,
      };

      const db = await connectToMongoDB();

      const result = await db
        .collection(collection.FACILITY_COLLECTION)
        .insertOne(datafacilities)
        .then((data) => {
          resolve(data.insertedId);
        });
    });
  },

  viewfacility: (hotel) => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      let facilitiesview = db
        .collection(collection.FACILITY_COLLECTION)
        .find({ facility: false , hotelId: hotel.hotelId })
        .toArray();
      resolve(facilitiesview);
    });
  },

  roomdelete: (deleteid) => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      await db
        .collection(collection.ROOMS_COLLECTION)
        .updateOne({ _id: new ObjectId(deleteid) }, { $set: { deleted: true } })
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

  editroom: (roomid) => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      await db
        .collection(collection.ROOMS_COLLECTION)
        .findOne({ _id: new ObjectId(roomid) })
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Candidate not found"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  roomedit: (userid, idroom, file) => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      await db
        .collection(collection.ROOMS_COLLECTION)
        .updateOne(
          { _id: new ObjectId(userid) },
          {
            $set: {
              Roomnumber: idroom.Roomnumber,
              RoomType: idroom.RoomType,
              Floor: idroom.Floor,
              Capacity: idroom.Capacity,
              Image: file.filename,
            },
          }
        )
        .then((response) => {
          // console.log("@@@@@@@@@response########", response);
          resolve();
        });
    });
  },

  editfacility: (facilityid) => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      await db
        .collection(collection.FACILITY_COLLECTION)
        .findOne({ _id: new ObjectId(facilityid) })
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            reject(new Error("Candidate not found"));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  facilityedit: (facilityid, idfacilities, file) => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      await db
        .collection(collection.FACILITY_COLLECTION)
        .updateOne(
          { _id: new ObjectId(facilityid) },
          {
            $set: {
              Facilities: idfacilities.Facilities,
              Image: file.filename,
            },
          }
        )
        .then((response) => {
          // console.log("@@@@@@@@@response########", response);
          resolve();
        });
    });
  },

  facilitiesdelete: (facilityid) => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      await db
        .collection(collection.FACILITY_COLLECTION)
        .updateOne(
          { _id: new ObjectId(facilityid) },
          { $set: { facility: true } }
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

  transactiondetails: (hotel) => {
    // console.log("Hotel ID:", hotel.hotelId);

    return new Promise(async (resolve, reject) => {
      try {
        const db = await connectToMongoDB();
        let transactionview = await db
          .collection(collection.PAYMENT_COLLECTION)
          .find({ hotelId: hotel.hotelId })
          .toArray();
        resolve(transactionview);
      } catch (error) {
        reject(error);
      }
    });
  },
};
