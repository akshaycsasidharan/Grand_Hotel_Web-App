// function verifyToken(req,res,next){
//     let authHeader = req.headers.authorization;
//     if(authHeader==undefined){
//         res.status(401).send({error: "no token provided"})
//     }
//     let token = authHeader.split(" ")[1]
//     Jwt.verify(token, "secret",function(err,decoded){
//         if(err){
//             res.status(500).send({error:"autherization failed"})
//         }
//         else{
//             next();
//         }
//     })
// }


// const verifyUser = (req, res, next) => {
//     if (req.jwt.loggedIn === true) {
//       return res.redirect("/allRooms");
//     }
//     next();
//   };

//   module.exports={
//     verifyUser
//   }
  