const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require(`${__dirname}/../controllers/userController`);

const authController = require('./../controllers/authController');
const router = express.Router();
router.post('/signup', authController.signup);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
