const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next)=>{
    let error ={...err}
    error.message = err.messages

    //log to console for dev
    // console.log(err.stack.red);

    //Mongoose bad objectId
     if(err.name==='CastError'){
        const message=`Inmate not found with id of ${err.value}`;
        error = new ErrorResponse(message,404);
     }

    console.log(err.name);
    res.status(err.statusCode || 500).json({
        success:false,
        error:err.message || 'server error'

    });
   
   
}

module.exports = errorHandler;