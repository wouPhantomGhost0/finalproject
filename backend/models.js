const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  dietaryPreferences: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);


const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: '',
    },
    budget: {
      type: String,
      trim: true,
    default: '',
    },
    cannotEat: {
      type: [String],
      default: [],
    },
    isHost: {
      type: Boolean,
      default: false,
    },
  },
  {_id: false}
);


const roomSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  host: {
    type: String,
    default: 'Host',
  },
  members: {
    type: [memberSchema],
    default: [],
  },
  status: {
    type: String,
    default: 'lobby',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Room = mongoose.model('Room', roomSchema);

module.exports = { User, Room };