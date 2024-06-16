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
} = require('../../controllers/usersController');

const {
  userSignUp,
  userLogin,
  protector,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../../controllers/authController');

userRouter.route('/signup').post(userSignUp);
userRouter.route('/login').post(userLogin);

userRouter.route('/forgot-password').post(forgotPassword);
userRouter.route('/reset-password/:token').post(resetPassword);

userRouter.route('/update-password').patch(protector, updatePassword);
userRouter.route('/update-me').patch(protector, updateMe);
userRouter.route('/delete-me').delete(protector, deleteMe);

userRouter.route('/').get(protector, getAllUsers).post(createdUser);
userRouter.route('/:id').get(getUser).patch(updatedUser).delete(deletedUser);

module.exports = userRouter;
