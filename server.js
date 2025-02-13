require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // MongoDB Connection

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Debugging: Check if MONGO_URI is loading
console.log("🔍 Loaded MONGO_URI:", process.env.MONGO_URI);

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ API Status Route
app.get('/api/status', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// ✅ Import API Routes
try {
    const apiRoutes = require('./routes/api');
    app.use('/api', apiRoutes);
} catch (error) {
    console.error("❌ Routes not found, make sure the file exists:", error.message);
}

// ✅ Global Error Handler (Catches Errors in Routes)
app.use((err, req, res, next) => {
    console.error("🔥 Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
