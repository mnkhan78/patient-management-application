const express = require("express");
const User = require("../models/user.model");

const router = express.Router();
const { generateToken, authorizeRoles, jwtAuthMiddleware } = require('../authetication/jwt.auth');

// get all users
router.get("/", jwtAuthMiddleware, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new user
router.post("/signup", jwtAuthMiddleware, authorizeRoles('admin'), async (req, res) => {
  try {
    const userData = req.body;

    //create a new Person instance using the Mongoose model
    const newUser = new User(userData);

    //save the new person to the database
    const savedUser = await newUser.save();

    //payload for the JWT token
    const payload = {
      id: savedUser._id,
      username: savedUser.username
    }

    //generate a JWT token for the newly created user
    const token = generateToken(payload);
    console.log("token is:", token);

    res.status(201).json({ user: savedUser, token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    //find the user by username
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    //check if the password matches
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    //payload for the JWT token
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role
    }
    //generate a JWT token for the logged in user

    const token = generateToken(payload);

    //store token in cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    res.status(200).json({ user: user, token: token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }

});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
})
  res.status(200).json({ message: 'Logout successful' });
});

module.exports = router;