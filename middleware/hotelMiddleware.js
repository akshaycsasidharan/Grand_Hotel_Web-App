const jwt = require("jsonwebtoken");

function verifyhotelToken(req, res, next) {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ error: "No token provided" });
    }
    let token = authHeader.split(" ")[1];
    jwt.verify(token, "secret", function (err, decoded) {
        if (err) {
            return res.status(403).send({ error: "Authentication failed" });
        }
        // If token is valid, you can access decoded information
        req.user = decoded; // Attach user information to request object for future use
        next();
    });
}

module.exports = verifyhotelToken;