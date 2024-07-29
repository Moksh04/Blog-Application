const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const salt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET;

router.route('/register').post(async (req, res) => {
  try {
    const { username, password } = req.body;

    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });

    res.json(userDoc);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.route('/login').post(async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const passOk = bcrypt.compareSync(password, user.password);

    if (!passOk) {
      throw new Error('Invalid Credentials');
    } else {
      // Logged In
      jwt.sign({ username, id: user._id }, jwtSecret, {}, (err, token) => {
        if (err) throw err;
        res.cookie('token', token).json({ username, id: user._id });
      });
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
});

router.route('/profile').get(async (req, res) => {
  try {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, (err, data) => {
      if (err) throw err;
      res.json(data);
    });
  } catch (err) {
    console.log(err.message);
  }
});

router.route('/logout').post(async (req, res) => {
  res.cookie('token', '').json('Logged Out');
});

module.exports = router;
