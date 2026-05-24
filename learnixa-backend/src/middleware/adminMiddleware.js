const jwt = require("jsonwebtoken");
const db = require("../config/db");

const SECRET_KEY = "learnixa_secret_key";

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    // Check if user is admin in database
    db.query(
      "SELECT is_admin FROM users WHERE id = ?",
      [decoded.id],
      (err, results) => {
        if (err) return res.status(500).json({ message: "Database error" });

        if (results.length === 0 || !results[0].is_admin) {
          return res.status(403).json({ message: "Access denied. Admins only." });
        }

        req.user = decoded;
        next();
      }
    );
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};

module.exports = verifyAdmin;