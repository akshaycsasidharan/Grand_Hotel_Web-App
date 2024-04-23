

const verifyHotel = (req,res,next) =>{
    if (req.session.HotelLoggedIn === true) {
        return res.redirect ("/")
    } 
    next();
}


const notVerifyHotel = (req, res, next) => {
    if (req.session.HotelLoggedIn === false) {
      return res.redirect("/login");
    }
    next();
  };
  
  
  
  
  module.exports={
    
    verifyHotel,
    notVerifyHotel,
    
  }