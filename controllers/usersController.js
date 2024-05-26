const User = require('../models/userModel');
const AppSuccess = require('../utils/appSuccess');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();
  return new AppSuccess(200, user, user.length).select(res);
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 500,
    message: 'Users route not found',
  });
};

exports.createdUser = (req, res) => {
  res.status(500).json({
    status: 500,
    message: 'Users route not found',
  });
};

exports.updatedUser = (req, res) => {
  res.status(500).json({
    status: 500,
    message: 'Users route not found',
  });
};

exports.deletedUser = (req, res) => {
  res.status(500).json({
    status: 500,
    message: 'Users route not found',
  });
};
