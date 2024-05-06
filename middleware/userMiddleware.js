
const verifyUser = (req, res, next) => {
    if (req.session.loggedIn) {
      return res.redirect("/"); // Redirect to homepage if user is already logged in
    }
    next();
  };
  
  const notVerifyUser = (req, res, next) => {
    if (!req.session.loggedIn) {
      return res.redirect("/login"); // Redirect to login page if user is not logged in
    }
    next();
  };
  
  module.exports = {
    verifyUser,
    notVerifyUser
  };
  