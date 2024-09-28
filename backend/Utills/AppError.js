// const AppError = (req,res,err,next)=>{
//     const statusCode = err.statusCode || 500 ;
//     const status = err.status || 'error';
//     const message = err.message || "Something Error on OUR Server Please Try Again";
    
//    res.status(statusCode).json({
//     status:status,
//     message:message,
//     //stack: process.env.NODE_ENV === 'development'? err.stack : null,
//    });
// }



// export default AppError;
class AppError extends Error {
    constructor(statusCode, status, message) {
      super(message);
      this.statusCode = statusCode;
      this.status = status;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
 export default AppError;
  