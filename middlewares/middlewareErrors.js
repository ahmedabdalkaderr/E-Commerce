const APIError = require('../utils/apiError');

const handleJWTInvalidSignature = () => new APIError('Invalid signature, pleaes login again',401);
const handleJWTExpireTime = () => new APIError('Expired token, please login again',401);
function global(err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") sendErrorDev(err, res);
  // eslint-disable-next-line no-use-before-define
  else {    
    if (err.name === "JsonWebTokenError") err = handleJWTInvalidSignature();
    if (err.name === "TokenExpiredError") err = handleJWTExpireTime();
      // eslint-disable-next-line no-use-before-define
      sendErrorProd(err, res);
  }
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
};
module.exports = global;
