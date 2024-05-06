const verifyHotel = (req, res, next) => {
  if (req.session.HotelLoggedIn) {
    return res.redirect("/hoteldashboard");
  }
  next();
};

const notVerifyHotel = (req, res, next) => {
  if (!req.session.HotelLoggedIn) {
    return res.redirect("/login"); // Redirect to login page if not logged in
  }
  next();
};

module.exports = {
  verifyHotel,
  notVerifyHotel,
};
