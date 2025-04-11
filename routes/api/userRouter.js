const express = require('express');

const router = express.Router();

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

router.route('/signup').post(userSignUp);
router.route('/login').post(userLogin);
router.route('/logout').post(userLogout);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password/:token').post(resetPassword);
router.route('/update-password').patch(protector, updatePassword);

router.use(protector);
router.route('/update-me').patch(uploadUserPhoto, resizeUserImg, updateMe);
router.route('/delete-me').delete(deleteMe);
router.route('/me').get(getMe, getUser);

router.use(restrictTo('admin', 'lead-guide'));
router.route('/').get(getAllUsers).post(createdUser);
router.route('/:id').get(getUser).patch(updatedUser).delete(deletedUser);

module.exports = router;
