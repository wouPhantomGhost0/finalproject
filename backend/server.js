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

    const hostName = (req.body.host || 'Host').trim();
    const hostEmail = (req.body.email || '').trim().toLowerCase();

    const newRoom = await Room.create({
      code,
      host: hostName,
      members: [
        {
          name: hostName,
          email: hostEmail,
          budget: '',
          cannotEat: [],
          isHost: true,
        },
      ],
    });

    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({message: 'Server error creating room.'});
  }
});


// SERCH ROOM
app.get('/api/rooms/:code', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase().trim();
    const room = await Room.findOne({ code });

    if(!room) {
      return res.status(404).json({message: 'Room not found.'});
    }

    res.json(room);
  }catch (err) {
    res.status(500).json({message: 'Server error finding room.'});
  }
});

// JOIN A ROOM OR INVITE A MEMBER BY USERNAME OR EMAIL
app.post('/api/rooms/:code/join', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase().trim();
    const room = await Room.findOne({ code });

    if(!room) {
      return res.status(404).json({message: 'Room not found.'});
    }

    const rawInput = (req.body.name || req.body.email || '').trim();
    if (!rawInput){
      return res.status(400).json({message: 'Please enter a name or email'});
    }

    const isEmail = rawInput.includes('@');
    const memberEmail = (req.body.email || (isEmail ? rawInput : '')).trim().toLowerCase();
    const memberName = (req.body.name || (isEmail ? rawInput.split('@')[0] : rawInput)).trim();

    const existingMember = room.members.find(
      (m) => (memberEmail && m.email.toLowerCase() === memberEmail) || m.name.toLowerCase() === memberName.toLowerCase()
    );

    if(!existingMember){
      room.members.push({
        name: memberName,
        email: memberEmail,
        budget: '',
        cannotEat: [],
        isHost: false,
      });
      await room.save();
    }else{
      let updated = false;
      if(memberEmail && !existingMember.email){
        existingMember.email = memberEmail;
        updated = true;
      }
      if (req.body.name && existingMember.name !== memberName){
        existingMember.name = memberName;
        updated = true;
      }
      if(updated) await room.save();
    }

    res.json(room);
  } catch (err) {
    console.error('Join room error:', err);
    res.status(500).json({message: 'Server error adding member to room.'});
  }
});
    

// UPDATE A MEMBER'S BUDGET AND CANNOT EAT LIST
app.put('/api/rooms/:code/preferences', async (req, res) => {
  try {
    const code = req.params.code.toUpperCase().trim();
    const {name, email, budget, cannotEat} = req.body;

    const room = await Room.findOne({ code });
    if(!room) {
      return res.status(404).json({message: 'Room not found.'});
    }

    const member = room.members.find(
      (m) => (email && m.email.toLowerCase() === email.toLowerCase().trim()) || (name && m.name.toLowerCase() == name.toLowerCase().trim())
    );

    if(!member) {
      return res.status(404).json({message: 'Member not found in room.'});
    }

    if(budget !== undefined) member.budget = budget;
    if (cannotEat !== undefined) member.cannotEat = cannotEat;

    await room.save();
    res.json(room);
  } catch (err) {
    res.status(500).json({message: 'Server error saving preferences.'})
  }
});

// leave room permanently
app.post('/api/rooms/:code/leave', async (req, res) => {
  try {
    const code =req.params.code.toUpperCase().trim();
    const {name, email} = req.body;

    const room = await Room.findOne({code});
    if(!room){
      return res.status(404).json({message: 'Room not found.'});
    }

    //Keep everyong except the person who is leaving
    room.members = room.members.filter((m) =>{
      const sameEmail = email && m.email && m.email.toLowerCase() === email.toLowerCase().trim();
      const sameName = name && m.name.toLowerCase() === name.toLowerCase().trim();
      return !(sameEmail || sameName);
    });

    if (room.members.length === 0){
      await Room.deleteOne({code});
      return res.json({deleted: true});
    }

    await room.save();
    res.json(room);
  } catch (err) {
    console.error('Leave room error', err);
    res.status(500).json({message: 'Server error leaving room.'});
  }
});


// get all active rooms for the logged-in user
app.get('/api/my-rooms', async(req, res) => {
  try {
    const email = (req.query.email || '').trim().toLowerCase();
    const name = (req.query.name || '').trim().toLowerCase();

    if(!email && !name){
      return res.json([]);
    }

    const allRooms = await Room.find().sort({_id: -1});
    const myRooms = allRooms.filter((room) =>
    room.members.some( (m) => 
      (email && m.email && m.email.toLowerCase() === email) || 
      (name && m.name && m.name.toLowerCase() === name)
    )
  );

  res.json(myRooms);
  } catch (err) {
    console.error('Fetch my rooms error:', err);
    res.status(500).json({message: 'Server error loading your rooms.'});
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));