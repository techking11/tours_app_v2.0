const User = require('../models/userModel');
const AppSuccess = require('../utils/appSuccess');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filteredObj = function (obj, ...allowedFields) {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'The route is not for changing password, use /update-password route !',
        400,
      ),
    );
  const filteredBody = filteredObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const deletedUser = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(200).json({
    status: 'success',
    data: deletedUser,
  });
});

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
