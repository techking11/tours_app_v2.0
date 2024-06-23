const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const jwtToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = function (user, statusCode, res) {
  const token = jwtToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  // remove password
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: user,
  });
};

exports.userSignUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);
  createSendToken(newUser, 201, res);
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

  createSendToken(user, 200, res);
});

exports.protector = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token)
    return next(
      new AppError(
        'You are not logged in. Please log in again to get access',
        401,
      ),
    );

  // Verfification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if user still exists
  const freshUser = await User.findById(decode.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist',
        401,
      ),
    );
  }

  // // check if the user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decode.iat)) {
    return next(
      new AppError('User recently changed password. Please loggin again', 401),
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  res.locals.user = freshUser;

  next();
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // Verfification token
      const decode = await promisify(jwt.verify)(
        req.cookies.jwt,
        process.env.JWT_SECRET,
      );

      // check if user still exists
      const freshUser = await User.findById(decode.id);
      if (!freshUser) {
        return next();
      }

      // // check if the user changed password after the token was issued
      if (freshUser.changedPasswordAfter(decode.iat)) {
        return next();
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      res.locals.user = freshUser;

      return next();
    }
    next();
  } catch (err) {
    return next();
  }
};

exports.userLogout = (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };

  res.cookie('jwt', 'loggedout', cookieOptions);
  res.status(200).json({
    status: 'success',
    message: 'Logout successfully !',
  });
};

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    // roles [admin, lead-guide].role = 'user'
    if (!roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );

    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('There is no user with your email', 404));

  // Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/forgot-password/${resetToken}`;

  const message = `Forgot your password? Please submit a PATCH request with new password and password confirm to: ${resetUrl} \nIf you don't forgot your password, please sign in again and ingnore this email ! `;

  await sendEmail({
    email: user.email,
    subject: 'Forgot password reset token !',
    message,
  });

  res.status(200).json({
    status: 'success',
    message: 'Token send to email !',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) get user based on the token
  const passwordResetToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) if token has not expired, there is user and set new password
  if (!user)
    return next(new AppError('Token is invalid and has expired !', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) log in user and send jwt
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) if the password is not same, posted the current password
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password)))
    return next(new AppError('Your currrent password was wrong !', 400));

  // 3) if so, set the current password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) log in user and send jwt
  createSendToken(user, 200, res);
});
