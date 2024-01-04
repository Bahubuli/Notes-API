const { StatusCodes } = require('http-status-codes');
const CustomAPIError = require('./custom-api');

class ForbiddenError extends CustomAPIError {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = {
  ForbiddenError,
};
