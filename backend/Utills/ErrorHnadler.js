const handleAppError = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || "Something went wrong on our server. Please try again.";
  
    res.status(statusCode).json({
      status: status,
      message: message,
    });
  };
  
  export default handleAppError;