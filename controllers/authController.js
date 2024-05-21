const User = require('../models/userModel');
const { responseSuccess } = require('../services/responses');
const catchAsync = require('../utils/catchAsync');

exports.userSignUp = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  responseSuccess(res, 201, user);
});
