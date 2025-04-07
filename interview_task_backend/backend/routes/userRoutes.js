const express = require('express');
const User = require('../models/User');
const { authMiddleware ,adminMiddleware,} = require('../middleware/authMiddleware');
const { getAllUsers, blockUser, unblockUser ,createUserByAdmin,updateUserByAdmin,deleteUserByAdmin} = require("../controllers/userController");
const router = express.Router();


router.get('/', authMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('_id name email role blocked');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get("/", authMiddleware, adminMiddleware, getAllUsers); 
router.patch("/:id/block", authMiddleware, adminMiddleware, blockUser); 
router.patch("/:id/unblock", authMiddleware, adminMiddleware, unblockUser); 
router.post("/create", authMiddleware, adminMiddleware, createUserByAdmin);      
router.put("/:id", authMiddleware, adminMiddleware, updateUserByAdmin);    
router.delete("/:id", authMiddleware, adminMiddleware, deleteUserByAdmin);

module.exports = router;
