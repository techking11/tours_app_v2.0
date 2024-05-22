const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const jwtToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.userSignUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const token = jwtToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
    data: newUser,
  });
});

exports.userLogin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // if email or password not exist
  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  // if email or password exist
  const user = await User.findOne({ email }).select('+password');
  const correctedPassword = await user.correctPassword(password, user.password);

  // if no user or wrong password
  if (!user || !correctedPassword)
    return next(new AppError('Invalid email and password', 401));

  const token = jwtToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
