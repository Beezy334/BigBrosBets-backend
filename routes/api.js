const express = require("express");
const router = express.Router();

// Example endpoint
router.get("/", (req, res) => {
  res.json({ message: "API Root is working!" });
});

router.get("/test", (req, res) => {
  res.json({ message: "This is a test endpoint!" });
});

module.exports = router;
