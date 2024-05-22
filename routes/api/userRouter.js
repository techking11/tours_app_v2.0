const express = require('express');

const userRouter = express.Router();

const {
  getAllUsers,
  createdUser,
  getUser,
  updatedUser,
  deletedUser,
} = require('../../controllers/usersController');
const { userSignUp, userLogin } = require('../../controllers/authController');

userRouter.route('/signup').post(userSignUp);
userRouter.route('/login').post(userLogin);

userRouter.route('/').get(getAllUsers).post(createdUser);
userRouter.route('/:id').get(getUser).patch(updatedUser).delete(deletedUser);

module.exports = userRouter;
