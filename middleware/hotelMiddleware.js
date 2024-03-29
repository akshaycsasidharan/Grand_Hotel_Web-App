const jwt = require("jsonwebtoken");

 function verifyhotelToken (req, res, next)  {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    jwt.verify(token, "secret", function (err, decoded) {
      if (err) {
        return res.status(403).json({ error: "Authentication failed" });
      } else {
        req.user = decoded; // Store decoded user information in request for further processing if needed
        next();
      }
    });
  } catch (error) {
    console.error("Error in token verification:", error);
    res.status(500).json({ error: "Internal server error" }); // Proper error handling for internal server errors
  }
};

module.exports = verifyhotelToken;


function verifyhotelToken(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decode = jwt.verify(token, "secret");

    req.user = decode;
    next();
  } catch (error) {
    if (error.name == "TokenExpiredError") {
      res.status(401).json({
        message: "Token Expired",
      });
    } else {
      res.json({
        message: "authentication failed",
      });
    }
  }
}



const verifyUser = (req, res, next) => {
  if (req.session.Userloggedin === true) {
    return res.redirect("/");
  }
  next();
};

const notVerifyUser = (req, res, next) => {
  if (req.session.Userloggedin === false) {
    return res.redirect("/login");
  }
  next();
};




module.exports={
  verifyUser,
  notVerifyUser,
  
}





// hotelMiddleware.js

const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
  try {
    const token = req.headers['authorization']?.split(" ")[1];
    if (token) {
      const jwtResponse = jwt.verify(token, 'secret');
      req.payload = jwtResponse.userId;
      next();
    } else {
      res.status(401).json("Please login");
    }
  } catch (error) {
    res.status(401).json("Invalid token");
  }
};

module.exports = jwtMiddleware;
