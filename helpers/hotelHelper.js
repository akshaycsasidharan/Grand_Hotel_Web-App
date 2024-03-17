require("dotenv").config();
var { connectToMongoDB } = require("../config/connection");
var collection = require("../config/collection");
const bcrypt = require("bcrypt");
const { ObjectId } = require("mongodb");
const { facility } = require("../controllers/hotelController");
const { response } = require("express");
const jwt = require("jsonwebtoken");


module.exports = {
  hoteldoSignup: (hotelsData,file) => {
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
        name: hotelsData.name,
        email: hotelsData.email,
        password: encryptedpassword,
        Image:file.filename,
        blocked: true,
        vote: false,
        usercount: 0,
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
          const token = jwt.sign({ userId: user._id, userEmail: user.email }, 'secret', { expiresIn: '24h' });
          return { token, user, status: true };
        }
      }
      return { status: false };
    } catch (error) {
      throw error;
    }
  },



  showcustomers: async () => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      let customerdata = await db
        .collection(collection.USER_COLLECTION)
        .find({})
        .toArray();
      resolve(customerdata);
    });
  },


  addrooms: (roomdata, file) => {
    // console.log("3#########@@@@@@@@@@2",roomdata);
    return new Promise(async (resolve, reject) => {
      let dataroom = {
        Roomnumber: roomdata.Roomnumber,
        RoomType: roomdata.RoomType,
        Floor: roomdata.Floor,
        Capacity: roomdata.Capacity,
        Image: file.filename,
        deleted: false,
      };

      const db = await connectToMongoDB();

      const result = await db
        .collection(collection.HOTEL_COLLECTION)
        .insertOne(dataroom)
        .then((data) => {
          resolve(data.insertedId);
        });
    });
  },


  addfacility: (facilitiesdata, file) => {
    return new Promise(async (resolve, reject) => {
      let datafacilities = {
        Facilities: facilitiesdata.Facilities,
        Image: file.filename,
        facility:false
      };

      const db = await connectToMongoDB();

      const result = await db
        .collection(collection.HOTEL_COLLECTION)
        .insertOne(datafacilities)
        .then((data) => {
          resolve(data.insertedId);
        });
    });
  },


  viewrooms: () => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      let roomsview = db
        .collection(collection.HOTEL_COLLECTION)
        .find({ deleted: false })
        .toArray();
      resolve(roomsview);
    });
  },


  viewfacility: () => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
    let facilitiesview = db.collection(collection.HOTEL_COLLECTION)
        .find({ facility: false })
        .toArray();
        resolve(facilitiesview)
    });
  },


  roomdelete: (deleteid) => {
    return new Promise(async (resolve, reject) => {
      const db = await connectToMongoDB();
      await db
        .collection(collection.HOTEL_COLLECTION)
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
        .collection(collection.HOTEL_COLLECTION)
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
        .collection(collection.HOTEL_COLLECTION)
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
        .collection(collection.HOTEL_COLLECTION)
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
        .collection(collection.HOTEL_COLLECTION)
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
        .collection(collection.HOTEL_COLLECTION)
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
};
