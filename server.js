require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI; // Ensure this is being read

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ Validate MONGO_URI before attempting to connect
if (!MONGO_URI) {
    console.error("❌ ERROR: MONGO_URI is not set. Check your .env file.");
    process.exit(1); // Stop the server if the database URL is missing
}

// ✅ Connect to MongoDB
mongoose.connect("mongodb+srv://BigBrosAdmin:Jayline1993@bigbrosbets.9uv9v.mongodb.net/?retryWrites=true&w=majority&appName=BigBrosBets", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1); // Exit if the database connection fails
    });

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
