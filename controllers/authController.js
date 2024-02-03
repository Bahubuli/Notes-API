const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const { attachCookiesToResponse, createTokenUser } = require("../utils/jwt");

const signup = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;

    const emailAlreadyExists = await User.findOne({ email });
    if (emailAlreadyExists) {
      throw new CustomError.BadRequestError("Email already exists");
    }


    const user = await User.create({ name, email, password });

    const tokenUser = { name: user.name, userId: user._id, role: user.role };

    attachCookiesToResponse({ res, user: tokenUser });
 console.log(req.body)
    res.status(StatusCodes.CREATED).send({ user: user.name, tokenUser });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new CustomError.BadRequestError(
        "please provide email and password"
      );

    const user = await User.findOne({ email });

    if (!user)
      throw new CustomError.UnauthenticatedError("Invalid credentials ");

    const isPassswordCorrect = await user.comparePassword(password);

    if (!isPassswordCorrect)
      throw new CustomError.UnauthenticatedError("Invalid credentials ");

    const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.CREATED).json({ user: tokenUser });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  res.cookie("token", "randomstring", {
    httpOnly: true,
    expires: new Date(Date.now() + 1 * 1000),
  });

  res.status(StatusCodes.OK).json({ msg: "user logged out" });
};

module.exports = {
  signup,
  login,
  logout,
};
