const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    min: [10, 'name length must be more than 10 characters'],
    max: [50, 'name length must be less than 10 characters'],
    required: [true, 'please tell us your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      // validator: function (val) {
      //   const match = /^\S+@\S+\.\S+$/;
      //   return match.test(val);
      // },
      validator: validator.isEmail,
      message: `Invalid email !`,
    },
  },
  photo: {
    type: String,
    // reuired: [true, 'User image is required!'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    min: [8, 'Password must have more than 8 symbols'],
    // max: [36, 'password must have less than 36 symbols'],
    // select: false,
  },
  passwordConfirm: {
    type: String,
    required: [false, 'Please confirm your password'],
    validate: {
      //this only works on CREATE or  Save!!!!
      validator: function (val) {
        return val === this.password;
      },
      message: 'Passwords are not the same',
    },
  },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  //Delete the password confirm field
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
