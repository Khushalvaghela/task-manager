const express = require('express');
const User = require('../models/User');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();


router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('_id name email');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
