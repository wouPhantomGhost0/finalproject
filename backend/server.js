require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const {User, Room} = require('./models');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB (Make sure MONGO_URI is in your backend/.env file)
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/cravematch')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// SIGN UP ROUTE
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during sign up.' });
  }
});

// LOG IN ROUTE
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// CREATE ROOM ROUTE
app.post('/api/rooms/create', async (req, res) => {
  try {
    let code;
    let exists = true;

    //make a new room code
    while(exists) {
      code = Math.random().toString(36).substring(2, 8).toUpperCase();
      exists = await Room.findOne({ code });
    }

    const newRoom = await Room.create({
      code,
      host: req.body.host || 'Host',
    });

    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({message: 'Server error creating room.'});
  }
});

    // SEARCH / JOIN A ROOM ROUTE
    app.get('/api/rooms/:code', async (req, res) => {
      try {
        const code = req.params.code.toUpperCase();
        const room = await Room.findOne({ code });

        if(!room) {
          return res.status(404).json({message: 'Room not found.'});
        }

        res.json(room);
      } catch (err) {
        res.status(500).json({message: 'Server error finding room.'});
      }
    });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));