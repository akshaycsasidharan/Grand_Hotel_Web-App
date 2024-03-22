const jwt = require("jsonwebtoken");

// function verifyhotelToken(req, res, next) {
//     let authHeader = req.headers.authorization;
//     if (authHeader===undefined) {
//         return res.status(401).send({ error: "No token provided" });
//     }
//     let token = authHeader.split(" ")[1];
//     jwt.verify(token, "secret", function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ error: "Authentication failed" });
//         }
//         else{
//             // req.user = decoded;
//             next();
//         }

//     });
// }

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

module.exports = verifyhotelToken;
