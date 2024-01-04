const { StatusCodes } = require('http-status-codes');

const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err);

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later',
  };

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',');
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyValue
    )} field, please choose another value`;
    customError.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === 'CastError') {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = StatusCodes.NOT_FOUND;
  }

  if (err.name === 'JsonWebTokenError') {
    customError.msg = 'Invalid token';
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  if (err.name === 'TokenExpiredError') {
    customError.msg = 'Token has expired';
    customError.statusCode = StatusCodes.UNAUTHORIZED;
  }

  if (err.name === 'ForbiddenError') {
    customError.msg = 'Permission denied: You do not have the necessary permissions to perform this action.';
    customError.statusCode = StatusCodes.FORBIDDEN;
    // Additional handling specific to ForbiddenError, if needed
  }

  // Add more error checks as needed

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = errorHandlerMiddleware;
