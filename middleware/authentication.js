const CustomError = require("../errors");
const { isTokenValid } = require("../utils/jwt");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.signedCookies.token;

    if (!token || token === undefined)
      throw new CustomError.UnauthenticatedError("Authentication Invalid");

    const { name, userId } = isTokenValid({ token });
    req.user = { name, userId };
    next();
  } catch (error) {
    next(error);
  }
};

const authorizePermission = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.Unauthorized("Unauthorized to access this route");
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermission,
};
