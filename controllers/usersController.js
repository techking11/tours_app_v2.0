const User = require('../models/userModel');
const { responseSuccessTotal } = require('../services/responses');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();
  responseSuccessTotal(res, 200, user);
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
