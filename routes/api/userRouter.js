const express = require('express');

const userRouter = express.Router();

const {
  getAllUsers,
  createdUser,
  getUser,
  updatedUser,
  deletedUser,
  updateMe,
  deleteMe,
  getMe,
  resizeUserImg,
  uploadUserPhoto,
} = require('../../controllers/usersController');

const {
  userSignUp,
  userLogin,
  protector,
  forgotPassword,
  resetPassword,
  updatePassword,
  restrictTo,
  userLogout,
} = require('../../controllers/authController');

userRouter.route('/signup').post(userSignUp);
userRouter.route('/login').post(userLogin);
userRouter.route('/logout').post(userLogout);
userRouter.route('/forgot-password').post(forgotPassword);
userRouter.route('/reset-password/:token').post(resetPassword);
userRouter.route('/update-password').patch(protector, updatePassword);

userRouter.use(protector);
userRouter.route('/update-me').patch(uploadUserPhoto, resizeUserImg, updateMe);
userRouter.route('/delete-me').delete(deleteMe);
userRouter.route('/me').get(getMe, getUser);

userRouter.use(restrictTo('admin', 'lead-guide'));
userRouter.route('/').get(getAllUsers).post(createdUser);
userRouter.route('/:id').get(getUser).patch(updatedUser).delete(deletedUser);

module.exports = userRouter;
