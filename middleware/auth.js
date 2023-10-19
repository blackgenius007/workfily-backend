const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse.js');

// protect routes
exports.protect = asyncHandler(async (req,res,next)=>{
let token;

if(
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
){
token = req.headers.authorization.split('')[1];
}
//make sure token exist
if(!token){
    return next(new ErrorResponse  ('Not Authorize to access this route',401))
}

try{

// verify token
 const decoded=jwt.verify(token,process.env.JWT_SECRET);
 console.log(decoded);
 req.user = await User.findById(decoded.id);

 next();

}catch (err){
    return next(new ErrorResponse ('Not Authorize to access this route',401))
}

})
