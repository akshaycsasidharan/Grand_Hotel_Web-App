const { CURSOR_FLAGS } = require("mongodb");
const { render, response } = require("../app");
const hotelHelper = require("../helpers/hotelHelper");
const multer = require("multer");


module.exports = {
  signuppage: (req, res, next) => {
    res.render("hotel/hotelSignup");
  },

  hotelsignup: (req, res) => {
    try {
      hotelHelper.hoteldoSignup(req.body,req.file).then((response) => {
        console.log("$$$$$$$$$$",response);
        res.redirect("/hotel");
      });
    } catch (error) {
      console.log(error);
    }
  },

  hotelloginPage: (req, res, next) => {

    if (req.session.loggedIn) {
      return res.redirect("hotel/hotelDashboard");
      } else {
      res.render("hotel/hotelLogin", {
        Hotel: true,
        loginErr: req.session.loginErr,
        block: req.session.block,
      });
      req.session.loginErr = false;
      req.session.block = false;
    }

  },


hotellogin: (req, res, next) => {
  
  hotelHelper.hotelLogin(req.body).then((response) => {
    if(response.status){
      req.session.loggedIn = true;
      req.session.hotel = response.hotel;
      res.render("hotel/hotelDashboard");
    }else {
      req.session.loginErr = true;
      res.render("/", { error: response.message });
    }
  })
  
},
  
  hoteldashboard: (req, res, next) => {
    let hotel = req.session.hotel;
    console.log("hotelllllllllllll $$$$$",hotel);
    console.log("====================== session =================",req.session);

    res.render("hotel/hotelDashboard",{
      hotel,
      Hotel : true
    });
  },

  addroomspage : (req, res) => {
    let hotelId = req.params.id;
    console.log("hotelId",hotelId);
    res.render("hotel/addRooms",{
      hotelId
    });
  },

  addfacilitiespage: (req, res) => {
    res.render("hotel/addFacilities");
  },

  addrooms: (req, res) => {

    console.log("addroomssssssssss ======");

    let hotelId = req.params.id;

    console.log("reqqqq.params.idd",req.params.id);
    try {
      hotelHelper.addrooms(req.body, req.file,hotelId).then((insertedId) => {
        console.log("Room inserted with ID:", insertedId);
        res.redirect("/hotel/rooms");
      }).catch((error) => {
        console.error("Error adding room:", error);
        res.status(500).send("Error adding room");
      });
    } catch (error) {
      console.log(error);
      res.status(500).send("Error adding room");
    }
  },

  addfacilities: (req, res) => {
    console.log("@@@@@@@@@@@@@@@@@@", req.body);
    try {
      hotelHelper.addfacility(req.body, req.file).then((response) => {
        // console.log("%%%%%%%%%%%%%%%%%",response);
        res.redirect("/hotel/facilities");
      });
    } catch (error) {
      console.log(error);
    }
  },
  
  roomspage: (req, res) => {

    console.log("##########$$#^GGFN B BN BB G");

      let hotel = req.session.hotel;

      console.log(("========= hotel ======",hotel));

    let hoteldetails = req.params.id;

    console.log("hoteldetailssss",hoteldetails);

    hotelHelper.viewrooms(hoteldetails).then(async (viewdata) => {

      console.log("hoteldetails",hoteldetails);

      res.render("hotel/rooms", {

        viewdata,
        hotel
      });
    });
  },

  facilitypage: (req, res) => {
    console.log("###########33", req.body);

    hotelHelper.viewfacility().then((facilitiesdata) => {
      res.render("hotel/facilities", {
        facilitiesdata,
      });
    });
  },
  
  editrooms: (req, res) => {
    let id = req.params.id;

    hotelHelper.editroom(id).then((result) => {
      res.render("hotel/editRooms", { result });
    });
  },

  roomedit: (req, res) => {
    let id = req.params.id;

    hotelHelper.roomedit(id, req.body, req.file).then(() => {
      res.redirect("/hotel/rooms");
    });
  },

  editfacilities: (req, res) => {
    let facilityid = req.params.id;
    hotelHelper.editfacility(facilityid).then((data) => {
      res.render("hotel/editFacilities", { data });
    });
  },

  facilityedit: (req, res) => {
    let idfacility = req.params.id;
    hotelHelper.facilityedit(idfacility, req.body, req.file).then(() => {
      res.redirect("/hotel/facilities");
    });
  },

  deleteroom: (req, res) => {
    let id = req.params.id;
    hotelHelper.roomdelete(id).then(() => {
      res.redirect("/hotel/rooms"); // Corrected redirect path
    });
  },

  deletefacilities: (req, res) => {
    let id = req.params.id;
    hotelHelper.facilitiesdelete(id).then(() => {
      res.redirect("/hotel/facilities");
    });
  },

  customers: (req, res) => {
    hotelHelper.showcustomers().then(async (customerdata) => {
      res.render("hotel/hotelCustomers", {
        customerdata,
      });
    });
  },

  transactions: (req, res) => {

    hotelHelper.transactiondetails().then((transactiondata) => {

      res.render("hotel/transactions", {
        transactiondata
      });

    })
  },





  reviews: (req, res) => {
    res.render("hotel/reviews");
  },
  
};
