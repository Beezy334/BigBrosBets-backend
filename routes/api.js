const express = require("express");
const router = express.Router();

// In-memory storage for now (Replace with MongoDB later)
let users = [];
let bets = [];
let games = [
    { id: 1, teams: "Lakers vs. Heat", odds: { Lakers: -150, Heat: +130 }, status: "upcoming" },
    { id: 2, teams: "Warriors vs. Celtics", odds: { Warriors: +120, Celtics: -140 }, status: "upcoming" }
];

// ✅ Root API Route
router.get("/", (req, res) => {
    res.json({ message: "API Root is working!" });
});

// ✅ Test Route
router.get("/test", (req, res) => {
    res.json({ message: "This is a test endpoint!" });
});

// 🛠️ USER AUTHENTICATION (TEMPORARY STORAGE - REPLACE WITH DATABASE LATER)
// ✅ Register a New User
router.post("/auth/register", (req, res) => {
    const { username, password } = req.body;
    
    // Ensure request body is correctly formatted
    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    // Check if user exists
    if (users.find(user => user.username === username)) {
        return res.status(400).json({ error: "Username already exists" });
    }

    // Store user (In real setup, hash the password)
    const newUser = { id: users.length + 1, username, password, balance: 100 }; // Default balance: 100
    users.push(newUser);
    res.status(201).json({ message: "User registered successfully", user: newUser });
});

// ✅ Login a User
router.post("/auth/login", (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json({ message: "Login successful", user });
});

// 🎲 BETTING ROUTES
// ✅ Place a Bet
router.post("/bets", (req, res) => {
    const { username, gameId, team, amount } = req.body;
    const user = users.find(u => u.username === username);
    const game = games.find(g => g.id === gameId);

    if (!user) return res.status(400).json({ error: "User not found" });
    if (!game) return res.status(400).json({ error: "Game not found" });
    if (user.balance < amount) return res.status(400).json({ error: "Insufficient balance" });

    // Deduct balance & store bet
    user.balance -= amount;
    const bet = { id: bets.length + 1, username, gameId, team, amount, status: "pending" };
    bets.push(bet);

    res.json({ message: "Bet placed successfully", bet, newBalance: user.balance });
});

// ✅ View All Bets
router.get("/bets", (req, res) => {
    res.json(bets);
});

// ✅ View User-Specific Bets
router.get("/bets/:username", (req, res) => {
    const { username } = req.params;
    const userBets = bets.filter(bet => bet.username === username);

    res.json(userBets);
});

// 🏀 GAME DATA ROUTES
// ✅ Get All Upcoming Games
router.get("/games", (req, res) => {
    const upcomingGames = games.filter(g => g.status === "upcoming");
    res.json(upcomingGames);
});

// ✅ Get Specific Game by ID
router.get("/games/:id", (req, res) => {
    const game = games.find(g => g.id == req.params.id);
    if (!game) return res.status(404).json({ error: "Game not found" });

    res.json(game);
});

module.exports = router;
