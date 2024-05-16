const express = require('express');
const userRouter = express.Router();

const {
  getAllUsers,
  createdUser,
  getUser,
  updatedUser,
  deletedUser,
} = require('../../controllers/usersController');

userRouter.route('/').get(getAllUsers).post(createdUser);
userRouter.route('/:id').get(getUser).patch(updatedUser).delete(deletedUser);

module.exports = userRouter;
