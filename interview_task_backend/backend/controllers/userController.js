const User = require("../models/User");
const bcrypt = require("bcryptjs");
exports.getAllUsers = async (req, res) => {
  try {
    
    // admin all user get 
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const users = await User.find().select("name email role blocked");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const userId = req.params.id;

  //  only admin block user 
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.blocked = true;
    await user.save();

    res.json({ message: "User blocked successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const userId = req.params.id;

  // ubblock user only admin 
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.blocked = false;
    await user.save();

    res.json({ message: "User unblocked successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// POST /api/users/
exports.createUserByAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log("🧾 Raw password to hash:", password);
    // const hashedPassword = await bcrypt.hash(password, 10);

    // const newUser = new User({ name, email, password: hashedPassword, role });
    const newUser = new User({ name, email, password, role });
    await newUser.save();

    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// PUT /api/users/:id
exports.updateUserByAdmin = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    const userId = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
// DELETE /api/users/:id
exports.deleteUserByAdmin = async (req, res) => {
  try {
    const userId = req.params.id;

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
