require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

console.log("📩 EMAIL_USER:", process.env.EMAIL_USER);
console.log("🔑 EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded" : "Not Loaded");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
connectDB();

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use("/api/users", require("./routes/userRoutes"));


// Default Route
app.get('/', (req, res) => {
  res.send('Task Management API is Running!');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
